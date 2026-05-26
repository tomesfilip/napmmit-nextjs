'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(priceId: string) {
  const origin = (await headers()).get('origin');

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded', // This enables the 2026 Embedded UI
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return { clientSecret: session.client_secret };
}
