import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  type CreateReservationInput,
  createPaidReservation,
} from '@/lib/reservation/actions';
import { stripe } from '@/lib/stripe';
import { parseReservationCheckoutMetadata } from '@/lib/stripe/reservation-checkout';
import db from '@/server/db/drizzle';
import { reservations } from '@/server/db/schema';

type CheckoutSessionProcessingResult =
  | { success: true }
  | { error: string; status: number };

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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown webhook error';

    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === 'checkout.session.completed') {
    const result = await processCompletedCheckoutSession(event.data.object);

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}

async function processCompletedCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<CheckoutSessionProcessingResult> {
  const existingReservation = await db.query.reservations.findFirst({
    where: eq(reservations.stripeCheckoutSessionId, session.id),
    columns: { id: true },
  });

  if (existingReservation) {
    return { success: true };
  }

  const parsedMetadata = parseReservationCheckoutMetadata(
    session.metadata ?? {},
  );

  if (!parsedMetadata.success) {
    return { error: parsedMetadata.error, status: 400 };
  }

  const result = await createPaidReservation(
    parsedMetadata.data satisfies CreateReservationInput,
    {
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: getPaymentIntentId(session.payment_intent),
      paidAt: session.created ? new Date(session.created * 1000) : new Date(),
    },
  );

  if ('error' in result) {
    if (result.error === 'insufficient_beds_available') {
      await refundFailedPaidCheckoutSession(session, result.error);
      return { error: result.error, status: 500 };
    }

    return { error: result.error, status: 400 };
  }

  return { success: true };
}

function getPaymentIntentId(
  paymentIntent: string | Stripe.PaymentIntent | null,
) {
  if (!paymentIntent) return null;
  return typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id;
}

async function refundFailedPaidCheckoutSession(
  session: Stripe.Checkout.Session,
  error: string,
) {
  const paymentIntentId = getPaymentIntentId(session.payment_intent);

  if (!paymentIntentId) {
    console.error('Paid checkout session failed without a payment intent:', {
      checkoutSessionId: session.id,
      error,
    });
    return;
  }

  try {
    const refund = await stripe.refunds.create(
      { payment_intent: paymentIntentId },
      { idempotencyKey: `failed-paid-reservation:${session.id}` },
    );

    console.error('Paid checkout session failed and was refunded:', {
      checkoutSessionId: session.id,
      paymentIntentId,
      refundId: refund.id,
      error,
    });
  } catch (refundError) {
    console.error('Paid checkout session failed and refund failed:', {
      checkoutSessionId: session.id,
      paymentIntentId,
      error,
      refundError,
    });
  }
}
