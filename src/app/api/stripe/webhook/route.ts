import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Stripe signature is not set' },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not set' },
      { status: 400 },
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is not set' },
          { status: 400 },
        );
      }

      const priceId = session.metadata?.priceId;
      if (!priceId) {
        return NextResponse.json(
          { error: 'Price ID is not set' },
          { status: 400 },
        );
      }

      console.log(`Payment confirmed for ${session.id}`);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown webhook error';

    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
