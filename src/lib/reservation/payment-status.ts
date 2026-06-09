import { eq } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { reservations } from '@/server/db/schema';

export type ReservationPaymentStatus =
  | { status: 'missing_session' }
  | { status: 'not_found' }
  | {
      status: 'reservation_created';
      reservationId: number;
      reservationStatus: string;
      paymentStatus: string;
    };

export async function getReservationPaymentStatus(
  checkoutSessionId: string | undefined,
): Promise<ReservationPaymentStatus> {
  if (!checkoutSessionId) {
    return { status: 'missing_session' };
  }

  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.stripeCheckoutSessionId, checkoutSessionId),
    columns: {
      id: true,
      status: true,
      paymentStatus: true,
    },
  });

  if (!reservation) {
    return { status: 'not_found' };
  }

  return {
    status: 'reservation_created',
    reservationId: reservation.id,
    reservationStatus: reservation.status,
    paymentStatus: reservation.paymentStatus,
  };
}
