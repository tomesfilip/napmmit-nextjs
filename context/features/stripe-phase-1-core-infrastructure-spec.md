# Stripe Integration Phase 1: Core Infrastructure

## Overview

Build the payment foundation needed for Napmmit reservation fees without changing the user-facing reservation flow yet. This phase prepares Stripe configuration, payment-aware reservation data, reusable reservation helpers, and unit tests so Phase 2 can wire Checkout, webhooks, and UI with less risk.

Reference: `docs/stripe-integration-plan.md`.

## Goal

Napmmit should be ready to support a fixed EUR 1 reservation fee and EUR 0.50 refund using Stripe Checkout Sessions. Phase 1 does not need to open Checkout or process live webhooks. It should make the core domain logic testable and make the database capable of storing payment state.

## Scope

- Move Stripe reservation configuration out of hardcoded values and into environment variables.
- Add payment/refund constants and typed metadata helpers.
- Add reservation payment fields to the database schema and generate a Drizzle migration.
- Refactor reservation validation, availability checks, and reservation insertion into reusable server helpers.
- Ensure reservation creation can happen inside a database transaction.
- Align availability checks so both `pending` and `confirmed` reservations reduce available beds.
- Add a unit test setup and unit tests for pure/payment-adjacent logic.

## Out Of Scope

- Embedded Checkout UI.
- Calling Stripe Checkout from the reservation form.
- Creating reservations from Stripe webhooks.
- Stripe CLI testing.
- Production Stripe Dashboard configuration.
- Refund execution against Stripe.

## Functional Requirements

### Stripe Configuration

- `src/lib/stripe.ts` reads `STRIPE_SECRET_KEY` from the environment.
- `STRIPE_RESERVATION_PRICE_ID` is read from the environment, not hardcoded.
- The Stripe SDK client sets an explicit API version: `2026-04-22.dahlia`.
- `.env.example` documents:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_RESERVATION_PRICE_ID`
- Server-side Stripe credentials remain server-only. Prefer restricted API keys for deployed environments once exact permissions are known.

### Reservation Payment Model

- Store money in cents.
- Add explicit reservation payment fields to `src/server/db/schema.ts`:
  - `reservationFeeCents`, default `100`
  - `refundAmountCents`, default `0`
  - `paymentStatus`, default `unpaid` or `paid` depending on creation path
  - `stripeCheckoutSessionId`, unique
  - `stripePaymentIntentId`
  - `stripeRefundId`
  - `paidAt`
  - `refundedAt`
- Add a payment status enum with:
  - `unpaid`
  - `paid`
  - `refunded`
  - `refund_failed`
- Keep existing reservation status values aligned with the project spec:
  - `pending`
  - `confirmed`
  - `cancelled`
  - `completed`

If renaming `reservationFee` and `refundAmount` is too disruptive, keep them temporarily but update comments/docs to say values are cents. Prefer explicit `*Cents` names before Phase 2 if no production data depends on the current columns.

### Stripe Reservation Helpers

Create `src/lib/stripe/reservation-checkout.ts` for shared reservation payment primitives:

```ts
export const RESERVATION_FEE_CENTS = 100;
export const RESERVATION_REFUND_CENTS = 50;
export const RESERVATION_CURRENCY = 'eur';
```

This module should also define typed helpers for Checkout Session metadata:

- `serializeReservationCheckoutMetadata(input)`
- `parseReservationCheckoutMetadata(metadata)`

Metadata should include only the minimum data needed to recreate the reservation after payment:

- `userId`, when logged in
- `cottageId`
- `from`
- `to`
- `bedsReserved`
- `totalPrice`
- `guestEmail`, when anonymous
- `guestPhone`, when anonymous

Metadata helpers must not include secrets, Stripe keys, full cottage objects, or large serialized payloads.

### Reservation Domain Helpers

Refactor `src/lib/reservation/actions.ts` so Phase 2 can reuse the same server-side checks from both server actions and webhook code.

Required helper shape:

- `validateReservationInput(input)`
- `assertReservationAvailability(input)`
- `createPaidReservation(input, payment)`

The exact return types should follow the existing `{ success, data, error }` style used by server actions. Keep helpers server-only when they import database, auth, or Stripe SDK code.

`createPaidReservation` must:

- Create the reservation as `pending`.
- Insert matching `reservation_days` records.
- Store Stripe payment identifiers passed in by the caller.
- Store `reservationFeeCents`, `paymentStatus`, and `paidAt`.
- Run reservation insertion and `reservation_days` insertion in one transaction.

### Availability Consistency

Availability checks must count both `pending` and `confirmed` reservations. This avoids overbooking when a paid reservation is awaiting owner confirmation.

Acceptance rule:

- If two reservations compete for the last available beds, the second creation attempt must fail once the first pending reservation exists.

## Suggested Files

- `src/lib/stripe.ts`
- `.env.example`
- `src/lib/stripe/reservation-checkout.ts`
- `src/lib/reservation/actions.ts`
- `src/server/db/schema.ts`
- Drizzle migration file under the existing migrations location
- Unit test files colocated with the tested modules or in the repo's chosen test directory

## Unit Test Requirements

Phase 1 must add unit tests. If the project does not already have a test runner, add the smallest compatible setup for TypeScript tests and document the command in `package.json`.

Minimum coverage:

- Reservation fee constants are cents-based:
  - fee is `100`
  - refund is `50`
  - currency is `eur`
- Checkout metadata serialization converts numbers to strings accepted by Stripe metadata.
- Checkout metadata parsing:
  - accepts valid metadata
  - rejects missing `cottageId`
  - rejects invalid date values
  - rejects non-numeric `bedsReserved`
  - preserves optional anonymous contact fields
- Reservation input validation:
  - rejects missing dates
  - rejects invalid date ranges
  - rejects guest count below one
  - requires email or phone for anonymous reservations
- Availability logic counts `pending` and `confirmed` reservations and ignores `cancelled` and `completed` reservations.

Use mocks or pure helper extraction for database-dependent tests. Do not require a real Neon/Postgres database for Phase 1 unit tests.

## Acceptance Criteria

- Stripe configuration has no hardcoded price ID.
- `.env.example` includes all Stripe variables needed by Phase 2.
- Reservation payment fields exist in Drizzle schema and migration.
- Money fields are documented and stored in cents.
- Reservation validation and creation logic is reusable outside the current direct UI path.
- Reservation creation can run transactionally.
- Availability checks treat `pending` and `confirmed` reservations consistently.
- Unit tests pass locally with the documented test command.
- `bun lint-format` passes.
- `bun build` passes.

## Implementation Notes

- Do not pass `payment_method_types` in any Stripe API call. Let Stripe dynamic payment methods choose eligible methods.
- Keep the existing direct reservation UI behavior until Phase 2 changes the flow.
- Avoid creating unpaid reservations in Phase 1 unless preserving current behavior requires it.
- Do not put reservation creation behind the browser return page. Phase 2 will use the signed webhook as the source of payment confirmation.
