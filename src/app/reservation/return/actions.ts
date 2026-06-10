'use server';

import { getReservationPaymentStatus } from '@/lib/reservation/payment-status';

export async function getReservationReturnStatus(checkoutSessionId: string) {
  return getReservationPaymentStatus(checkoutSessionId);
}
