import db from '@/server/db/drizzle';
import { reservations, ReservationType } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { validateRequest } from '../auth/validateRequest';

export type CreateReservationDataType = {
  bedsReserved: ReservationType['bedsReserved'];
  from: ReservationType['from'];
  to: ReservationType['to'];
  totalPrice: ReservationType['totalPrice'];
  cottageId: ReservationType['cottageId'];
  userId?: ReservationType['userId'];
  guestEmail?: ReservationType['guestEmail'];
  guestPhone?: ReservationType['guestPhone'];
};

async function prepareReservationData(data: CreateReservationDataType) {
  const { user } = await validateRequest();
  if (!user) throw new Error('Unauthorized');

  if (!data.bedsReserved) throw new Error('Beds reserved is required');
  if (!data.from) throw new Error('Check-in date is required');
  if (!data.to) throw new Error('Check-out date is required');
  if (!data.cottageId) throw new Error('Cottage ID is required');
  if (!data.userId && !data.guestEmail && !data.guestPhone)
    throw new Error('Missing user info');
  if (!data.totalPrice) throw new Error('Total price is required');

  const dateFrom = new Date(data.from);
  const dateTo = new Date(data.to);

  const diffTime = Math.abs(
    dateTo.getMilliseconds() - dateFrom.getMilliseconds(),
  );
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const pricePerNight = data.totalPrice / diffDays;
  console.log('Price per night: ', pricePerNight);

  return {
    userId: data.userId ?? null,
    guestEmail: data.guestEmail ?? null,
    guestPhone: data.guestPhone ?? null,
    bedsReserved: data.bedsReserved,
    from: dateFrom.toISOString().split('T')[0],
    to: dateTo.toISOString().split('T')[0],
    pricePerNight: pricePerNight,
    totalPrice: data.totalPrice,
    status: 'pending',
    cottageId: data.cottageId,
    accessToken: crypto.randomUUID(),
  };
}

export async function createReservation(data: ReservationType) {
  const reservationData = await prepareReservationData(data);

  try {
    const newReservation = await db
      .insert(reservations)
      .values(reservationData)
      .returning({ id: reservations.id });

    return newReservation;
  } catch (error) {
    console.error('Reservation creation failed: ', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to create reservation');
  }
}

export async function updateReservation(data: ReservationType) {}

export async function deleteReservation(reservationId: ReservationType['id']) {
  const deletedReservation = await db
    .delete(reservations)
    .where(eq(reservations.id, reservationId))
    .returning({ id: reservations.id });

  return deletedReservation;
}
