'use server';

import { after } from 'next/server';
import { sendReservationConfirmationEmailOnce } from '@/lib/reservation/confirmation';
import { getReservationPaymentStatus } from '@/lib/reservation/payment-status';

export async function getReservationReturnStatus(checkoutSessionId: string) {
  const paymentStatus = await getReservationPaymentStatus(checkoutSessionId);

  if (
    paymentStatus.status === 'reservation_created' &&
    paymentStatus.paymentStatus === 'paid'
  ) {
    after(() =>
      sendReservationConfirmationEmailOnce(paymentStatus.reservationId),
    );
  }
  

  return paymentStatus;
}
