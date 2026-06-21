import { and, eq } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { reservations } from '@/server/db/schema';
import {
  mapReservationToConfirmationSummary,
  type ReservationConfirmationSummary,
} from './summary';

const reservationSummaryQuery = {
  with: {
    cottage: {
      columns: {
        id: true,
        name: true,
        address: true,
        email: true,
        phoneNumber: true,
        website: true,
      },
    },
    user: {
      columns: {
        username: true,
        email: true,
        phoneNumber: true,
      },
    },
  },
} as const;

export async function getReservationConfirmationSummaryByCheckoutSession(
  checkoutSessionId: string,
): Promise<ReservationConfirmationSummary | null> {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.stripeCheckoutSessionId, checkoutSessionId),
    ...reservationSummaryQuery,
  });

  if (!reservation) {
    return null;
  }

  return mapReservationToConfirmationSummary(reservation);
}

export async function getReservationConfirmationSummaryByAccessToken(
  accessToken: string,
): Promise<ReservationConfirmationSummary | null> {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.accessToken, accessToken),
    ...reservationSummaryQuery,
  });

  if (!reservation) {
    return null;
  }

  return mapReservationToConfirmationSummary(reservation);
}

export async function getReservationConfirmationSummaryById(
  reservationId: number,
  userId: string,
): Promise<ReservationConfirmationSummary | null> {
  const reservation = await db.query.reservations.findFirst({
    where: and(
      eq(reservations.id, reservationId),
      eq(reservations.userId, userId),
    ),
    ...reservationSummaryQuery,
  });

  if (!reservation) {
    return null;
  }

  return mapReservationToConfirmationSummary(reservation);
}
