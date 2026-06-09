'use server';

import { headers } from 'next/headers';
import { validateRequest } from '@/lib/auth/validateRequest';
import type { CreateReservationInput } from '@/lib/reservation/actions';
import {
  assertReservationAvailability,
  validateReservationInput,
} from '@/lib/reservation/actions';
import { getStripeReservationPriceId, stripe } from '@/lib/stripe';
import { serializeReservationCheckoutMetadata } from '@/lib/stripe/reservation-checkout';

export type CreateReservationCheckoutSessionResult =
  | { success: true; clientSecret: string }
  | { error: string };

export async function createReservationCheckoutSession(
  input: CreateReservationInput,
): Promise<CreateReservationCheckoutSessionResult> {
  try {
    const origin =
      (await headers()).get('origin') ?? process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      return { error: 'missing_origin' };
    }

    const { user } = await validateRequest();
    const validated = await validateReservationInput({
      ...input,
      userId: user?.id ?? null,
    });

    if ('error' in validated) {
      return validated;
    }

    const availability = await assertReservationAvailability(validated.data);
    if ('error' in availability) {
      return availability;
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      line_items: [{ price: getStripeReservationPriceId(), quantity: 1 }],
      mode: 'payment',
      return_url: `${origin}/reservation/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: serializeReservationCheckoutMetadata(validated.data),
    });

    if (!session.client_secret) {
      return { error: 'checkout_session_failed' };
    }

    return { success: true, clientSecret: session.client_secret };
  } catch (error) {
    console.error('Reservation checkout session creation failed:', error);
    return { error: 'checkout_session_failed' };
  }
}
