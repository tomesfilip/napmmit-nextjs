'use server';

import db from '@/server/db/drizzle';
import { reservations } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { validateRequest } from '../auth/validateRequest';

export type CreateReservationInput = {
  cottageId: number;
  from: string; // ISO date string
  to: string; // ISO date string
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

    const dateFrom = new Date(data.from);
    const dateTo = new Date(data.to);

    if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
      return { error: 'invalid_dates' };
    }

    if (dateTo <= dateFrom) {
      return { error: 'to_date_before_from' };
    }

    const fromISO = dateFrom.toISOString().split('T')[0];
    const toISO = dateTo.toISOString().split('T')[0];

    // Overlap check: find any non-cancelled reservation that overlaps.
    // Two ranges overlap if: from < existing.to AND to > existing.from
    const overlappingReservations = await db.query.reservations.findMany({
      where: (table, funcs) =>
        funcs.and(
          funcs.eq(table.cottageId, data.cottageId),
          funcs.not(funcs.eq(table.status, 'cancelled')),
          funcs.lt(table.from, toISO),
          funcs.gt(table.to, fromISO),
        ),
      columns: { id: true },
      limit: 1,
    });

    if (overlappingReservations.length > 0) {
      return { error: 'dates_unavailable' };
    }

    const diffTime = dateTo.getTime() - dateFrom.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerNight = Math.round(data.totalPrice / diffDays);

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

    return { success: true, reservationId: newReservation.id };
  } catch (error) {
    console.error('Reservation creation failed:', error);
    return { error: 'reservation_failed' };
  }
}

export async function updateReservation(data: any) {}

export async function deleteReservation(reservationId: number) {
  const deletedReservation = await db
    .delete(reservations)
    .where(eq(reservations.id, reservationId))
    .returning({ id: reservations.id });

  return deletedReservation;
}
