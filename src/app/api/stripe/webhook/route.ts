import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not set' },
      { status: 400 },
    );
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

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

    const stripeReservation = await stripe.checkout.sessions.retrieve(
      session.id,
    );

    // 2026 Practice: Trigger a background sync or email service
    console.log(`💰 Payment confirmed for ${session.id}`);
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
