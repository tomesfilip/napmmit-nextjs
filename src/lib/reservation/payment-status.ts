import { eq } from 'drizzle-orm';
import type { PaymentStatusType, ReservationStatusType } from '@/lib/appTypes';
import { parseReservationStatus } from '@/lib/reservation/status';
import db from '@/server/db/drizzle';
import { reservations } from '@/server/db/schema';

export type ReservationPaymentStatus =
  | { status: 'missing_session' }
  | { status: 'not_found' }
  | {
      status: 'reservation_created';
      reservationId: number;
      reservationStatus: ReservationStatusType;
      paymentStatus: PaymentStatusType;
      accessToken: string | null;
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
      accessToken: true,
    },
  });

  if (!reservation) {
    return { status: 'not_found' };
  }

  return {
    status: 'reservation_created',
    reservationId: reservation.id,
    reservationStatus: parseReservationStatus(reservation.status),
    paymentStatus: reservation.paymentStatus,
    accessToken: reservation.accessToken,
  };
}
