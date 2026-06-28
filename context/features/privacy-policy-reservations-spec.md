# Privacy Policy — Reservations & Payment Data (P0 §9)

## Overview

The GDPR privacy policy at `src/app/(legal)/privacy-policy/page.tsx` predates paid reservations. It does not explicitly cover reservation data, payment metadata, or third-party processors (Stripe, Resend, Vercel Blob, Neon) added since reservations went live.

Reference: `docs/production-readiness-audit.md` — P0 §9.

**Important:** Required topics below are a technical checklist. Final Slovak legal wording requires qualified privacy/GDPR review.

## Goal

Extend Zásady ochrany osobných údajov so data subjects understand what reservation and payment data Napmmit collects, why, how long it is kept, and which subprocessors process it.

## Scope

- Update `src/app/(legal)/privacy-policy/page.tsx`.
- Add reservation- and payment-specific data categories, purposes, legal bases, retention, and subprocessors.
- Align with updated terms of use (`terms-of-use-reservations-spec.md`).
- Use shared legal constants for domain/operator when `src/lib/legal/constants.ts` exists.

## Out Of Scope

- Cookie policy rewrite (unless cross-links need updating).
- Data Processing Agreements with vendors (legal/ops task).
- English translation.
- DPIA document (advisor may recommend separately).

## Current State

Section 3 lists: account data, cottage owner listing data, technical/cookie data.

Missing explicit coverage for:

- Reservation records (dates, beds, guest name/email/phone, status)
- Stripe payment identifiers (`payment_intent`, checkout session, refund ids)
- Access tokens for guest reservation links
- Owner–guest communication metadata
- Email delivery logs / confirmation timestamps

Section 4 purposes omit reservation facilitation and payment processing.

No subprocessors section naming Stripe, Resend, Neon, Vercel Blob.

## Functional Requirements

### Extend §3 — Aké osobné údaje spracúvame

Add bullets for:

| Data | Examples |
|------|----------|
| Reservation data | Stay dates, beds, cottage id, status (`pending`/`confirmed`/…) |
| Guest contact | Name, email, phone (logged-in or guest checkout fields) |
| Payment metadata | Amounts, currency, payment status, Stripe IDs — **not** full card numbers |
| Access tokens | Opaque tokens for confirmation pages (treat as personal data if linkable) |

State that card data is entered on Stripe-hosted flows and Napmmit does not store PAN/CVV.

### Extend §4 — Účel spracovania

Add purposes:

- Processing and managing accommodation reservations.
- Collecting the Napmmit reservation fee and eligible refunds via Stripe.
- Sending transactional emails (confirmation, verification, password reset).
- Fraud prevention and platform security.

### Extend §5 — Právny základ

Map new processing to:

- **Contract** — account, reservations, fee payment.
- **Legal obligation** — accounting/tax retention where applicable.
- **Legitimate interest** — security, abuse prevention (document balancing test at high level).

### New or extended § — Príjemcovia / sprostredkovatelia

List categories and named providers:

| Provider | Role | Data shared |
|----------|------|-------------|
| Stripe | Payment processing | Payment metadata, customer email as needed |
| Resend | Email delivery | Recipient address, email content |
| Neon | Database hosting | All persisted personal data |
| Vercel | Hosting, Blob storage | Logs, uploaded cottage images |

Include that subprocessors are bound by GDPR-compliant terms where applicable.

### Extend §6 — Doba uchovávania

Add retention rules, for example:

- Reservation and payment records — duration required for accounting, disputes, and legal claims (specify period after advisor review, e.g. 5–10 years for accounting artifacts vs shorter for marketing).
- Access tokens — while reservation is active + reasonable period after stay.
- Confirmation email sent timestamp — align with reservation retention.

### Data subject rights

Confirm existing § on rights (access, erasure, portability) applies to reservation data; note limitations when legal retention applies.

### International transfers

If Stripe/US hosting applies, mention possible transfers outside EEA and safeguards (SCCs) — advisor wording.

### Domain

Update `www.napmmit.com` to production domain per `production-domain-setup-spec.md`.

## Suggested Files

- `src/app/(legal)/privacy-policy/page.tsx`
- `src/lib/legal/constants.ts` — shared operator/domain (if created for P0 §8)

## Testing

- Manual review checklist only.

## Manual Verification

1. Policy mentions reservations and Stripe payment metadata explicitly.
2. All production subprocessors listed match actual stack.
3. No claim that Napmmit stores full payment card details.
4. Retention section mentions reservation/payment records.
5. Operator contact details remain correct.
6. `bun build` passes.

## Acceptance Criteria

- Privacy policy covers reservation and payment processing.
- Subprocessors section includes Stripe, Resend, Neon, Vercel (Blob).
- Policy aligns with updated terms of use on fees and roles.
- GDPR advisor sign-off before launch (process requirement).
- `bun build` passes.

## Implementation Notes

- Keep Slovak inline JSX pattern consistent with terms and cookie policy.
- Account deletion flow already blocks users with active reservations — privacy policy should mention that some data may be retained post-deletion where legally required.

## Open Decisions

- Exact accounting retention period for payment records (tax advisor).
- Whether to publish "last updated" date on the page.
