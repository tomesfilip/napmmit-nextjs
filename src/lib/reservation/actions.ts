'use server';

import { and, eq, or, sum } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { cottages, reservationDays, reservations } from '@/server/db/schema';
import { validateRequest } from '../auth/validateRequest';
import { formatReservationDate } from '../reservation-date-range';
import { RESERVATION_FEE_CENTS } from '../stripe/reservation-checkout';
import {
  type ReservationValidationInput,
  type ValidatedReservationInput,
  validateReservationInputData,
} from './validation';

export type CreateReservationInput = ReservationValidationInput;

export type CreateReservationResult =
  | { success: true; reservationId: number }
  | { error: string };

export type ReservationPaymentInput = {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
  paidAt?: Date;
};

export async function validateReservationInput(
  data: CreateReservationInput,
): Promise<
  { success: true; data: ValidatedReservationInput } | { error: string }
> {
  return validateReservationInputData(data);
}

export async function assertReservationAvailability(
  data: ValidatedReservationInput,
): Promise<{ success: true } | { error: string }> {
  const cottage = await db.query.cottages.findFirst({
    where: eq(cottages.id, data.cottageId),
    columns: { totalBeds: true },
  });

  if (!cottage) {
    return { error: 'cottage_not_found' };
  }

  for (const date of data.reservationDates) {
    const existingReservations = await db
      .select({ totalBeds: sum(reservationDays.bedsReserved) })
      .from(reservationDays)
      .innerJoin(
        reservations,
        eq(reservationDays.reservationId, reservations.id),
      )
      .where(
        and(
          eq(reservationDays.date, date),
          eq(reservations.cottageId, data.cottageId),
          or(
            eq(reservations.status, 'pending'),
            eq(reservations.status, 'confirmed'),
          ),
        ),
      );

    const bookedBeds = Number(existingReservations[0]?.totalBeds) || 0;
    const availableBeds = cottage.totalBeds - bookedBeds;

    if (availableBeds < data.bedsReserved) {
      return { error: 'insufficient_beds_available' };
    }
  }

  return { success: true };
}

export async function createReservation(
  data: CreateReservationInput,
): Promise<CreateReservationResult> {
  try {
    const { user } = await validateRequest();
    const validated = await validateReservationInput({
      ...data,
      userId: user?.id ?? null,
    });

    if ('error' in validated) {
      return validated;
    }

    const availability = await assertReservationAvailability(validated.data);
    if ('error' in availability) {
      return availability;
    }

    return createReservationRecord(validated.data, { paymentStatus: 'unpaid' });
  } catch (error) {
    console.error('Reservation creation failed:', error);
    return { error: 'reservation_failed' };
  }
}

export async function createPaidReservation(
  data: CreateReservationInput,
  payment: ReservationPaymentInput,
): Promise<CreateReservationResult> {
  const validated = await validateReservationInput(data);
  if ('error' in validated) {
    return validated;
  }

  const availability = await assertReservationAvailability(validated.data);
  if ('error' in availability) {
    return availability;
  }

  return createReservationRecord(validated.data, {
    paymentStatus: 'paid',
    paidAt: payment.paidAt ?? new Date(),
    stripeCheckoutSessionId: payment.stripeCheckoutSessionId,
    stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
  });
}

async function createReservationRecord(
  data: ValidatedReservationInput,
  payment: {
    paymentStatus: 'unpaid' | 'paid';
    paidAt?: Date;
    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string | null;
  },
): Promise<CreateReservationResult> {
  return db.transaction(async (tx) => {
    const [newReservation] = await tx
      .insert(reservations)
      .values({
        userId: data.userId,
        guestEmail: data.guestEmail ?? null,
        guestPhone: data.guestPhone ?? null,
        bedsReserved: data.bedsReserved,
        reservationFeeCents: RESERVATION_FEE_CENTS,
        paymentStatus: payment.paymentStatus,
        stripeCheckoutSessionId: payment.stripeCheckoutSessionId,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        paidAt: payment.paidAt,
        from: data.fromISO,
        to: data.toISO,
        pricePerNight: data.pricePerNight,
        totalPrice: data.totalPrice,
        status: 'pending',
        cottageId: data.cottageId,
        accessToken: crypto.randomUUID(),
      })
      .returning({ id: reservations.id });

    if (!newReservation) {
      return { error: 'reservation_failed' };
    }

    await tx.insert(reservationDays).values(
      data.reservationDates.map((date) => ({
        reservationId: newReservation.id,
        date,
        bedsReserved: data.bedsReserved,
      })),
    );

    return { success: true, reservationId: newReservation.id };
  });
}

export async function deleteReservation(reservationId: number) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: 'unauthorized' };
    }

    // Verify user owns the reservation or the cottage
    const reservation = await db.query.reservations.findFirst({
      where: (table, funcs) => funcs.eq(table.id, reservationId),
      with: { cottage: { columns: { userId: true } } },
    });
    if (!reservation) {
      return { error: 'reservation_not_found' };
    }

    const isOwner = reservation.cottage?.userId === user.id;
    const isReservationHolder = reservation.userId === user.id;

    if (!isOwner && !isReservationHolder) {
      return { error: 'unauthorized' };
    }

    await db.delete(reservations).where(eq(reservations.id, reservationId));
    return { success: true };
  } catch (error) {
    console.error('Reservation deletion failed:', error);
    return { error: 'reservation_deletion_failed' };
  }
}

export async function confirmReservation(reservationId: number) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: 'unauthorized' };
    }

    const reservation = await db.query.reservations.findFirst({
      where: (table, funcs) => funcs.eq(table.id, reservationId),
      with: { cottage: { columns: { userId: true } } },
    });
    if (!reservation) {
      return { error: 'reservation_not_found' };
    }

    if (reservation.cottage?.userId !== user.id) {
      return { error: 'unauthorized' };
    }

    await db
      .update(reservations)
      .set({
        status: 'confirmed',
        updatedAt: formatReservationDate(new Date()),
      })
      .where(eq(reservations.id, reservationId));
    return { success: true };
  } catch (error) {
    console.error('Reservation confirmation failed:', error);
    return { error: 'reservation_confirmation_failed' };
  }
}
