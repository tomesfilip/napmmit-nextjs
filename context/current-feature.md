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
