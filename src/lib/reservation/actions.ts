'use server';

import { and, eq, sum } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { cottages, reservationDays, reservations } from '@/server/db/schema';
import { validateRequest } from '../auth/validateRequest';
import {
  formatReservationDate,
  getReservationDateStrings,
  getReservationNightCount,
  isValidReservationRange,
  parseReservationDateParam,
} from '../reservation-date-range';

export type CreateReservationInput = {
  cottageId: number;
  from: string; // yyyy-MM-dd date string
  to: string; // yyyy-MM-dd date string
  bedsReserved: number;
  totalPrice: number;
  guestEmail?: string;
  guestPhone?: string;
};

export type CreateReservationResult =
  | { success: true; reservationId: number }
  | { error: string };

export async function createReservation(
  data: CreateReservationInput,
): Promise<CreateReservationResult> {
  try {
    // Input validation
    if (!data.bedsReserved || data.bedsReserved < 1) {
      return { error: 'beds_required' };
    }
    if (!data.from) {
      return { error: 'from_date_required' };
    }
    if (!data.to) {
      return { error: 'to_date_required' };
    }
    if (!data.cottageId) {
      return { error: 'cottage_id_required' };
    }
    if (!data.totalPrice || data.totalPrice < 0) {
      return { error: 'total_price_required' };
    }

    const { user } = await validateRequest();

    // If no user, require guest contact info
    if (!user && !data.guestEmail && !data.guestPhone) {
      return { error: 'missing_guest_contact' };
    }

    const dateFrom = parseReservationDateParam(data.from);
    const dateTo = parseReservationDateParam(data.to);

    if (!dateFrom || !dateTo) {
      return { error: 'invalid_dates' };
    }

    if (!isValidReservationRange(dateFrom, dateTo)) {
      return { error: 'to_date_before_from' };
    }

    const fromISO = formatReservationDate(dateFrom);
    const toISO = formatReservationDate(dateTo);

    const diffDays = getReservationNightCount(dateFrom, dateTo);
    const pricePerNight = Math.round(data.totalPrice / diffDays);

    // Validate bed availability for each day
    const cottage = await db.query.cottages.findFirst({
      where: eq(cottages.id, data.cottageId),
      columns: { totalBeds: true },
    });

    if (!cottage) {
      return { error: 'cottage_not_found' };
    }

    // Check availability for each day in the reservation period
    const reservationDates = getReservationDateStrings(dateFrom, dateTo);

    for (const date of reservationDates) {
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
            eq(reservations.status, 'confirmed'),
          ),
        );

      const bookedBeds = Number(existingReservations[0]?.totalBeds) || 0;
      const availableBeds = cottage.totalBeds - bookedBeds;

      if (availableBeds < data.bedsReserved) {
        return { error: 'insufficient_beds_available' };
      }
    }

    const reservationData = {
      userId: user?.id ?? null,
      guestEmail: data.guestEmail ?? null,
      guestPhone: data.guestPhone ?? null,
      bedsReserved: data.bedsReserved,
      from: fromISO,
      to: toISO,
      pricePerNight: pricePerNight,
      totalPrice: data.totalPrice,
      status: 'pending' as const,
      cottageId: data.cottageId,
      accessToken: crypto.randomUUID(),
    };

    const [newReservation] = await db
      .insert(reservations)
      .values(reservationData)
      .returning({ id: reservations.id });

    if (!newReservation) {
      return { error: 'reservation_failed' };
    }

    // Create reservation day records
    const reservationDayRecords = reservationDates.map((date) => ({
      reservationId: newReservation.id,
      date,
      bedsReserved: data.bedsReserved,
    }));

    await db.insert(reservationDays).values(reservationDayRecords);

    return { success: true, reservationId: newReservation.id };
  } catch (error) {
    console.error('Reservation creation failed:', error);
    return { error: 'reservation_failed' };
  }
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
