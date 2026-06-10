# Stripe Integration Phase 2: Integration And UI

## Overview

Wire the Phase 1 payment infrastructure into the real reservation flow. This phase adds reservation-specific Checkout Session creation, embedded Checkout UI, signed webhook processing, return/status UX, and cancellation/refund behavior.

Reference: `docs/stripe-integration-plan.md`.

## Goal

Hikers pay a fixed EUR 1 reservation fee before Napmmit creates a reservation. Stripe Checkout collects the payment, and the signed Stripe webhook creates the `pending` reservation after payment confirmation. The browser return page only reports status; it must not create reservations.

## Scope

- Replace direct reservation creation from the cottage detail form with Checkout Session creation.
- Add embedded Stripe Checkout UI for the reservation fee.
- Add a Checkout return/status page.
- Implement signed webhook handling for payment-confirmed reservation creation.
- Make webhook processing idempotent.
- Add cancellation behavior that keeps reservation rows for auditability and supports EUR 0.50 refunds.
- Verify the full flow locally with Stripe CLI and Stripe test cards.

## Out Of Scope

- Full accommodation payment collection.
- Owner payouts or Stripe Connect.
- Subscriptions or recurring billing.
- Stripe Tax unless a launch decision is made before implementation.
- Access-token email flow for anonymous reservations unless separately specified.
- Production live-mode launch.

## User Flow

1. Hiker selects dates, guest count, and contact details when anonymous.
2. The client submits reservation input to a reservation-specific Checkout server action.
3. The server validates input and checks availability, but does not create a reservation.
4. The server creates an embedded Stripe Checkout Session for the fixed EUR 1 reservation fee.
5. The UI opens embedded Checkout.
6. Hiker completes payment.
7. Stripe sends `checkout.session.completed` to `/api/stripe/webhook`.
8. The webhook verifies the signature, parses metadata, re-checks availability, and creates the `pending` reservation.
9. The return/status page shows that payment was received and reservation processing is complete or still pending.

## Functional Requirements

### Checkout Session Action

Replace the generic `createCheckoutSession(priceId: string)` with a reservation-specific action, for example:

- `createReservationCheckoutSession(input)`

Requirements:

- Use the server-side `STRIPE_RESERVATION_PRICE_ID`; never accept a caller-provided price ID.
- Validate the same reservation input as the current direct reservation path.
- Check availability before creating the Checkout Session.
- Create an embedded Checkout Session with:
  - `ui_mode: 'embedded'`
  - `mode: 'payment'`
  - one line item for `STRIPE_RESERVATION_PRICE_ID`
  - `return_url` pointing to `/reservation/return?session_id={CHECKOUT_SESSION_ID}`
  - typed reservation metadata from Phase 1 helpers
- Return a typed result containing the `clientSecret` or an error code.
- Do not pass `payment_method_types`; rely on Stripe dynamic payment methods.

### Reservation UI

Update `src/components/cottageDetail/reservation-section.tsx` so the reserve button no longer creates a reservation directly.

Requirements:

- Keep current client-side validation and availability messaging.
- Build the same reservation input currently sent to `createReservation`.
- Call `createReservationCheckoutSession(input)`.
- Open a Checkout dialog only after the server returns a `clientSecret`.
- Do not invalidate availability immediately when Checkout opens.
- Show user-friendly errors when Checkout Session creation fails.
- Change success copy from "reservation created" to payment/reservation processing language unless status polling confirms the reservation exists.

Add `src/components/cottageDetail/reservation-checkout-dialog.tsx`.

Requirements:

- Client component.
- Uses `@stripe/stripe-js` and `@stripe/react-stripe-js`.
- Loads Stripe with `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Renders `EmbeddedCheckoutProvider` and `EmbeddedCheckout`.
- Uses existing dialog/modal patterns where possible.
- Handles close/cancel without creating a reservation.

### Return And Status Page

Add `src/app/reservation/return/page.tsx`.

Requirements:

- Read `session_id` from the query string.
- Display a clear status message:
  - payment received and reservation is processing
  - reservation created
  - payment not found or expired
- Optionally call a server helper to check whether a reservation exists for the Checkout Session ID.
- Never create a reservation from this page.

Optional helper:

- `src/lib/reservation/payment-status.ts`

### Webhook Processing

Update `src/app/api/stripe/webhook/route.ts`.

Requirements:

- Read the raw request body with `req.text()`.
- Require the `stripe-signature` header.
- Require `STRIPE_WEBHOOK_SECRET`.
- Verify the signature using `stripe.webhooks.constructEvent`.
- Avoid `any` in error handling.
- Handle `checkout.session.completed`.
- Ignore unsupported events with a `200` response.
- Treat duplicate completed sessions idempotently:
  - if `stripeCheckoutSessionId` already exists, return `200`
  - do not create duplicate reservations or duplicate `reservation_days`
- Parse reservation metadata with Phase 1 helpers.
- Re-check availability using the same rules as the UI and helper layer.
- Create the reservation and `reservation_days` in a transaction.
- Store Stripe identifiers:
  - Checkout Session ID
  - PaymentIntent ID when present
  - payment status
  - paid timestamp
- Return `400` for invalid signatures or invalid metadata.

If payment succeeds but availability is gone, do not create an invalid reservation. Log enough context for follow-up and define whether this should trigger an automatic refund in the cancellation/refund implementation.

### Cancellation And Refunds

Change paid reservation cancellation from hard delete to status update.

Requirements:

- Verify requester authorization.
- Keep reservation rows for auditability.
- Mark reservations as `cancelled`.
- For eligible hiker cancellations before the 48-hour cutoff, create a Stripe refund for EUR 0.50 using the stored PaymentIntent ID.
- Store:
  - `refundAmountCents`
  - `stripeRefundId`
  - `refundedAt`
  - `paymentStatus`
- If refund creation fails, store `refund_failed` and expose a visible state for admin follow-up.

Open product decisions before implementation:

- Should owner/admin cancellations automatically refund?
- Should webhook-created reservations that lose the availability race automatically refund?
- Should late hiker cancellations be rejected entirely or allowed without refund?

## Stripe CLI Testing

Phase 2 requires local Stripe CLI testing because signed webhooks and embedded Checkout need real Stripe event delivery.

Local setup:

```bash
bun dev
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the webhook signing secret printed by the Stripe CLI as `STRIPE_WEBHOOK_SECRET`.

Recommended test card:

```text
4242 4242 4242 4242
```

### Happy Path Checks

- Logged-in hiker can select dates and guests.
- Anonymous hiker must provide email or phone.
- Checkout opens for exactly EUR 1.
- Payment succeeds with the Stripe test card.
- Webhook receives `checkout.session.completed`.
- Webhook creates exactly one `pending` reservation.
- Webhook creates expected `reservation_days` rows.
- Stored reservation includes Checkout Session ID and PaymentIntent ID.
- Owner dashboard shows the pending reservation.
- Hiker dashboard shows the reservation for logged-in hikers.
- Return page shows a clear success or processing state.

### Failure And Edge Case Checks

- Failed payment does not create a reservation.
- Closing the browser after payment still creates the reservation via webhook.
- Duplicate `checkout.session.completed` events do not create duplicate reservations.
- Two hikers paying for the last available beds cannot overbook.
- Missing webhook signature returns `400`.
- Invalid webhook signature returns `400`.
- Missing required metadata is rejected and does not create a reservation.
- Expired Checkout Session does not create a reservation.
- Guest contact rules are enforced server-side.

### Refund Checks

- Hiker cancellation before the cutoff refunds EUR 0.50.
- Hiker cancellation after the cutoff follows the final product rule.
- Refund failure stores `refund_failed`.
- Cancelled reservations remain in the database.
- Cancelled reservations no longer reduce availability.

## Suggested Files

- `src/app/actions/stripe.ts`
- `src/components/cottageDetail/reservation-section.tsx`
- `src/components/cottageDetail/reservation-checkout-dialog.tsx`
- `src/app/reservation/return/page.tsx`
- `src/app/api/stripe/webhook/route.ts`
- `src/lib/reservation/payment-status.ts`
- `src/lib/reservation/actions.ts`
- `src/lib/stripe/reservation-checkout.ts`

## Acceptance Criteria

- Reservation form opens Stripe Checkout instead of directly creating a reservation.
- Checkout charges the fixed server-side EUR 1 reservation fee.
- The browser return page never creates reservations.
- The signed webhook creates paid `pending` reservations.
- Webhook processing is idempotent for duplicate Checkout Session events.
- Availability is re-checked after payment and before database insertion.
- Reservation and `reservation_days` insertion remains transactional.
- Cancellation updates status instead of deleting paid reservations.
- Eligible hiker cancellation refunds EUR 0.50 and stores refund state.
- Stripe CLI happy path and edge case checks pass locally.
- `bun lint-format` passes.
- `bun build` passes.

## Implementation Notes

- The webhook is the source of truth for payment confirmation.
- Avoid putting secrets or large payloads in Checkout metadata.
- Re-fetch cottage/pricing data server-side when creating the reservation.
- Keep user-facing copy honest when webhook processing may still be in progress.
- Use separate Stripe test and live keys/secrets.
- Configure the production webhook endpoint only after local test-mode behavior is verified.
