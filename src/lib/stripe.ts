import Stripe from 'stripe';

const STRIPE_API_VERSION = '2026-04-22.dahlia';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const STRIPE_RESERVATION_PRICE_ID =
  process.env.STRIPE_RESERVATION_PRICE_ID;

export function getStripeReservationPriceId() {
  if (!process.env.STRIPE_RESERVATION_PRICE_ID) {
    throw new Error('STRIPE_RESERVATION_PRICE_ID is not set');
  }

  return process.env.STRIPE_RESERVATION_PRICE_ID;
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // @ts-expect-error Stripe SDK types only accept the latest API version.
  apiVersion: STRIPE_API_VERSION,
});
