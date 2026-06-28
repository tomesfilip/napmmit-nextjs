# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup
- Fixed reservation date handling to use date-only `yyyy-MM-dd` values instead of UTC `toISOString()` conversions, preventing one-day shifts across timezones; also removed duplicate/unused reservation code.
- Fixed reservation total price calculation to update when the guest count changes by including guests in the `nights × pricePerNight` calculation and display breakdown.
- Completed Stripe Integration Phase 1 core infrastructure: environment-driven Stripe config, reservation payment schema and migration, reusable checkout metadata and reservation helpers, transaction-safe reservation creation, pending/confirmed availability blocking, and focused unit tests.
- Completed Stripe Integration Phase 2 UI flow: reservation form now opens embedded Stripe Checkout for the fixed reservation fee, signed webhooks create paid pending reservations idempotently, the return page redirects to reservations after webhook processing, and paid cancellation preserves audit rows with eligible refund handling.
- Completed Reservation Confirmed Flow Phase 1: added confirmation email tracking columns and migration, shared `ReservationConfirmationSummary` module, idempotent `sendReservationConfirmationEmailOnce()` coordinator, expanded confirmation email template with Slovak translations, background email trigger on the Stripe return page via `after()`, and unit tests for summary formatting, recipient resolution, and send idempotency.
- Completed Reservation Confirmed Flow Phase 2: replaced the post-payment dashboard redirect with a server-rendered confirmation page on `/reservation/return`, changed polling success to `router.refresh()`, added shared `ReservationConfirmationDetails` with post-payment and dashboard variants, linked hiker reservation cards to `/dashboard/reservations/[id]`, extended payment status helpers and summary queries, added Slovak translations, moved the Stripe webhook to `/api/webhooks/stripe`, and added focused unit tests.
- Completed Profile Page: extended `/profile` with react-hook-form sections for email, name, and phone; profile server actions with email re-verification and account deletion guards; searchable country phone input with E.164 validation; Slovak translations; shared email verification helper; and focused unit tests.
- Completed Cottage Image Upload Authentication (P0 §3): secured `/api/cottage-images/upload` with Lucia session validation via `validateRequestFromRequest`, role-based guard (`cottage_owner`/`admin` only) in `assertCanUploadCottageImages`, `401`/`403` responses, `userId` in blob `tokenPayload`, and unit tests.
