import Stripe from 'stripe';

export const STRIPE_RESERVATION_PRICE_ID = 'price_1T1piw1j5JDvJD5mxnTmQOHo';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
