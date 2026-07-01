'use server';

import { after } from 'next/server';
import { sendReservationConfirmationEmailOnce } from '@/lib/reservation/confirmation';
import { getReservationPaymentStatus } from '@/lib/reservation/payment-status';
import { fulfillPaidCheckoutSession } from '@/lib/stripe/fulfill-checkout-session';

export async function getReservationReturnStatus(checkoutSessionId: string) {
  let paymentStatus = await getReservationPaymentStatus(checkoutSessionId);

  if (paymentStatus.status === 'not_found') {
    await fulfillPaidCheckoutSession(checkoutSessionId);
    paymentStatus = await getReservationPaymentStatus(checkoutSessionId);
  }

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
