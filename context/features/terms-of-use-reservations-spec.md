# Terms of Use — Reservations & Payments (P0 §7)

## Overview

The published terms at `src/app/(legal)/terms-of-use/page.tsx` state that Napmmit is **not** a reservation intermediary. The product now processes paid Stripe reservations end-to-end (€1 fee, €0.50 refund on eligible cancellation). Legal copy must match live behavior before public launch.

Reference: `docs/production-readiness-audit.md` — P0 §7; `docs/project-spec.md` reservation rules.

**Important:** This spec defines required topics and technical placement. Final Slovak legal wording must be reviewed by a qualified advisor before launch.

## Goal

Update Obchodné podmienky so they accurately describe Napmmit's role as a reservation platform, payment flows, fees, cancellations, and third-party processors.

## Scope

- Rewrite/add sections in `src/app/(legal)/terms-of-use/page.tsx` (inline Slovak JSX as today).
- Cover all audit-listed topics (see Functional Requirements).
- Cross-reference privacy policy and cookie policy where processors are listed.
- Update domain references when production domain is chosen (coordinate with `production-domain-setup-spec.md`).
- Add a short changelog note at the bottom or in git commit message (not necessarily on the page).

## Out Of Scope

- Full rewrite of unrelated sections that remain accurate.
- PDF terms appendix (see `reservation-confirmed-phase-3-pdf-spec.md`).
- English translation of legal pages.
- eKasa / VAT invoice legal text beyond describing the reservation fee nature.

## Current State

- §2 Predmet služby lists listing/search/contact only and explicitly denies reservation intermediary role.
- No mention of: Stripe, reservation fee, refund amount, 48h cancellation, pending vs confirmed lifecycle.
- Domain hardcoded as `www.napmmit.com`.
- Operator block: Filip Tomeš, IČO 17658969, info@napmmit.com.

## Functional Requirements

### Napmmit's role (replace or extend §2)

Clarify that Napmmit:

- Facilitates reservation requests between hikers and cottage owners.
- Collects a **rezervačný poplatok** (€1) via Stripe on behalf of the platform.
- Does **not** provide the accommodation itself — the stay contract remains between guest and cottage owner.
- Holds reservations in `pending` until owner confirms, then `confirmed` (align with `docs/reservations.md`).

### Payments

New or extended section must include:

| Topic | Required content |
|-------|------------------|
| Reservation fee | €1 (100 cents), purpose as platform service charge |
| Payment processor | Stripe Payments Europe (or current Stripe entity); card data handled by Stripe |
| Accommodation price | Informational on platform; paid directly to cottage unless policy changes |
| Refund on cancellation | €0.50 returned to guest when hiker cancels ≥48h before stay start (per product rules) |
| Failed / disputed payments | Reference Stripe and support contact |

### Cancellations

- Hiker-initiated cancellation rules and fee refund eligibility (48-hour rule).
- Owner confirm / reject impact on reservation status.
- Platform limitation of liability for stay disputes.

### Third-party services (processors)

Name subprocessors used in production:

- **Stripe** — payments
- **Resend** — transactional email
- **Vercel** — hosting; **Vercel Blob** — image storage
- **Neon** — database hosting

Point readers to privacy policy for data processing detail.

### User obligations

- Accurate guest contact details for reservations.
- Owners must respond to pending reservations in reasonable time (optional product rule — document if enforced).

### Governing law & changes

- Keep Slovak governing law.
- State that material changes are published on the website with effective date.

### Domain

Replace `www.napmmit.com` with the chosen production domain once registered (likely `napmmit.sk` per `docs/what-to-fix.md`). Until then, use a placeholder constant or `NEXT_PUBLIC_APP_URL` host in non-legal contexts only — legal pages may need explicit final hostname.

## Suggested Files

- `src/app/(legal)/terms-of-use/page.tsx`
- Optionally `src/lib/legal/constants.ts` — operator name, IČO, domain (shared with privacy policy and PDF legal constants later)

## Testing

- No automated tests required for legal JSX.
- Manual legal review checklist (see Manual Verification).

## Manual Verification

1. Read §2 (or successor) — no longer claims zero reservation intermediary role without qualification.
2. Stripe and fee amounts match `src/lib/stripe/reservation-checkout.ts` constants.
3. 48h cancellation matches reservation cancel logic in codebase.
4. All listed processors match production stack.
5. Links to `/privacy-policy` and `/cookie-policy` work.
6. `bun build` passes.

## Acceptance Criteria

- Terms describe paid reservations, fees, refunds, and Stripe.
- Terms list payment-related subprocessors.
- Terms distinguish platform fee from accommodation payment.
- Legal advisor sign-off obtained before launch (process requirement — track outside code).
- `bun build` passes.

## Implementation Notes

- Keep page as server component Slovak JSX to match cookie/privacy policy pattern.
- Do not scrape terms into PDF at runtime; PDF legal copy remains a separate module when Phase 3 ships.
- After domain purchase, grep for `napmmit.com` across `src/app/(legal)/` and update consistently.

## Open Decisions

- Exact legal characterization of Napmmit as "sprostredkovateľ" vs "poskytovateľ služby rezervácie" — advisor decision.
- Whether to publish effective date of revised terms on the page.
