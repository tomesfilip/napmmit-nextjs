'use server';

import { differenceInHours } from 'date-fns';
import { and, eq, gte, lt, or, sum } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { cottages, reservationDays, reservations } from '@/server/db/schema';
import { validateRequest } from '../auth/validateRequest';
import {
  formatReservationDate,
  parseReservationDateParam,
} from '../reservation-date-range';
import {
  RESERVATION_FEE_CENTS,
  RESERVATION_REFUND_CENTS,
} from '../stripe/reservation-checkout';
import {
  type ReservationValidationInput,
  type ValidatedReservationInput,
  validateReservationInputData,
} from './validation';

export type CreateReservationInput = ReservationValidationInput;

export type CreateReservationResult =
  | { success: true; reservationId: number }
  | { error: string };

export type DeleteReservationResult = { success: true } | { error: string };

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

  const reservedBedsByDate = await db
    .select({
      date: reservationDays.date,
      totalBeds: sum(reservationDays.bedsReserved),
    })
    .from(reservationDays)
    .innerJoin(reservations, eq(reservationDays.reservationId, reservations.id))
    .where(
      and(
        eq(reservations.cottageId, data.cottageId),
        gte(reservationDays.date, data.fromISO),
        lt(reservationDays.date, data.toISO),
        or(
          eq(reservations.status, 'pending'),
          eq(reservations.status, 'confirmed'),
        ),
      ),
    )
    .groupBy(reservationDays.date);

  for (const { totalBeds } of reservedBedsByDate) {
    const bookedBeds = Number(totalBeds) || 0;
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
    // Serialize reservation writes per cottage so availability is checked against a stable occupancy snapshot.
    const [cottage] = await tx
      .select({ totalBeds: cottages.totalBeds })
      .from(cottages)
      .where(eq(cottages.id, data.cottageId))
      .for('update');

    if (!cottage) {
      return { error: 'cottage_not_found' };
    }

    const reservedBedsByDate = await tx
      .select({
        date: reservationDays.date,
        totalBeds: sum(reservationDays.bedsReserved),
      })
      .from(reservationDays)
      .innerJoin(
        reservations,
        eq(reservationDays.reservationId, reservations.id),
      )
      .where(
        and(
          eq(reservations.cottageId, data.cottageId),
          gte(reservationDays.date, data.fromISO),
          lt(reservationDays.date, data.toISO),
          or(
            eq(reservations.status, 'pending'),
            eq(reservations.status, 'confirmed'),
          ),
        ),
      )
      .groupBy(reservationDays.date);

    for (const { totalBeds } of reservedBedsByDate) {
      const bookedBeds = Number(totalBeds) || 0;
      const availableBeds = cottage.totalBeds - bookedBeds;

      if (availableBeds < data.bedsReserved) {
        return { error: 'insufficient_beds_available' };
      }
    }

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

export async function deleteReservation(
  reservationId: number,
): Promise<DeleteReservationResult> {
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

    if (reservation.status === 'cancelled') {
      return { success: true };
    }

    const refundUpdate =
      isReservationHolder && reservation.paymentStatus === 'paid'
        ? await refundEligibleHikerCancellation(reservation)
        : { success: true as const };

    if ('error' in refundUpdate) {
      const refundFailed = isRefundExecutionFailure(refundUpdate.error);

      await db
        .update(reservations)
        .set({
          status: 'cancelled',
          ...(refundFailed ? { paymentStatus: 'refund_failed' as const } : {}),
          updatedAt: formatReservationDate(new Date()),
        })
        .where(eq(reservations.id, reservationId));

      return refundFailed ? refundUpdate : { success: true };
    }

    await db
      .update(reservations)
      .set({
        status: 'cancelled',
        ...('data' in refundUpdate ? refundUpdate.data : {}),
        updatedAt: formatReservationDate(new Date()),
      })
      .where(eq(reservations.id, reservationId));

    return { success: true };
  } catch (error) {
    console.error('Reservation deletion failed:', error);
    return { error: 'reservation_deletion_failed' };
  }
}

function isRefundExecutionFailure(error: string | undefined) {
  return error === 'refund_failed';
}

async function refundEligibleHikerCancellation(reservation: {
  from: string;
  stripePaymentIntentId: string | null;
}) {
  const checkInDate = parseReservationDateParam(reservation.from);

  if (!checkInDate) {
    return { error: 'invalid_dates' };
  }

  if (differenceInHours(checkInDate, new Date()) < 48) {
    return { error: 'cancellation_cutoff_passed' };
  }

  if (!reservation.stripePaymentIntentId) {
    return { error: 'missing_payment_intent' };
  }

  try {
    const { stripe } = await import('../stripe');
    const refund = await stripe.refunds.create({
      payment_intent: reservation.stripePaymentIntentId,
      amount: RESERVATION_REFUND_CENTS,
    });

    return {
      success: true as const,
      data: {
        refundAmountCents: RESERVATION_REFUND_CENTS,
        stripeRefundId: refund.id,
        refundedAt: new Date(),
        paymentStatus: 'refunded' as const,
      },
    };
  } catch (error) {
    console.error('Reservation refund failed:', error);
    return { error: 'refund_failed' };
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
