# Production Domain Setup (P0 §8)

## Overview

No production domain is registered yet. The codebase and legal copy reference `napmmit.com`, while `docs/what-to-fix.md` targets `napmmit.sk` for Slovakia-first positioning. Without a owned domain, production URL, email verification, Stripe webhooks, and legal URLs remain placeholders.

Reference: `docs/production-readiness-audit.md` — P0 §8.

## Goal

Register the chosen production domain, wire DNS and third-party services, and update the codebase so `NEXT_PUBLIC_APP_URL`, email sender domains, and legal copy use the real hostname before launch.

## Scope

- Domain purchase and DNS checklist (ops).
- Vercel production project / custom domain binding.
- Resend domain verification (SPF, DKIM).
- Stripe live mode webhook and return URLs on production host.
- Code and content updates for hardcoded `napmmit.com` references.
- Document final domain choice in README or `.env.example`.

## Out Of Scope

- Staging/develop subdomain setup (P2 — develop environment).
- SEO sitemap/OG (P2).
- Trademark or legal entity registration beyond domain purchase.

## Current State

Hardcoded references include:

| Location | Reference |
|----------|-----------|
| `src/lib/constants.ts` | `noreply@napmmit.com`, `support@napmmit.com` |
| `src/app/(legal)/terms-of-use/page.tsx` | `www.napmmit.com` |
| `src/app/(legal)/privacy-policy/page.tsx` | `www.napmmit.com` |
| `src/app/(legal)/cookie-policy/page.tsx` | `www.napmmit.com` |
| `context/features/reservation-confirmed-phase-3-pdf-spec.md` | `napmmit.com` in legal constants |

`NEXT_PUBLIC_APP_URL` drives Stripe return URLs, confirmation email links, and PDF URLs in `src/lib/reservation/confirmation.ts`.

`EMAIL_SENDER_RESEND = 'onboarding@resend.dev'` used when domain not verified.

## Functional Requirements

### Domain decision

Choose primary production hostname before purchase:

- **Recommended:** `napmmit.sk` (audit + what-to-fix alignment).
- **Alternative:** `napmmit.com` if brand strategy prefers .com — then update what-to-fix and marketing copy.

Record decision in README deployment section.

### Purchase & DNS

1. Register domain at registrar.
2. Point DNS to Vercel (A/CNAME per Vercel docs).
3. Enable TLS (automatic on Vercel).
4. Optional: `www` → apex redirect.

### Vercel production environment

Set production env vars:

```
NEXT_PUBLIC_APP_URL=https://napmmit.sk   # or chosen host
```

Verify:

- `/` loads over HTTPS
- `/api/webhooks/stripe` reachable from Stripe (live webhook after go-live)

### Resend email domain

1. Add domain in Resend dashboard.
2. Configure SPF, DKIM (and DMARC recommended) DNS records.
3. Verify domain.
4. Update `EMAIL_SENDER` in `src/lib/constants.ts` to `noreply@<production-domain>`.
5. Switch production from `EMAIL_SENDER_RESEND` / `onboarding@resend.dev` to verified sender.

### Stripe live mode

- Create live webhook endpoint: `https://<domain>/api/webhooks/stripe`
- Set live `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_RESERVATION_PRICE_ID` in Vercel production.
- Confirm Checkout `success_url` / `cancel_url` use `NEXT_PUBLIC_APP_URL`.

### Codebase string migration

Grep and update:

```bash
rg 'napmmit\.com' --glob '!node_modules'
```

Targets:

- `src/lib/constants.ts`
- All `src/app/(legal)/**` pages
- Any email templates with example URLs
- `src/lib/pdf/legal-constants.ts` when PDF phase ships

Prefer a single `src/lib/legal/constants.ts`:

```ts
export const LEGAL_DOMAIN = 'napmmit.sk';
export const LEGAL_WEB_URL = `https://www.${LEGAL_DOMAIN}`;
export const EMAIL_NOREPLY = `noreply@${LEGAL_DOMAIN}`;
```

Legal pages import constants instead of hardcoding strings.

### Pre-launch verification

| Check | Method |
|-------|--------|
| HTTPS valid | Browser + `curl -I` |
| Email from production sender | Send test via Resend |
| Stripe webhook delivery | Stripe dashboard event log |
| Confirmation email links | Complete test reservation in live mode (small amount) |
| Legal page URLs | Open terms, privacy, cookies on production host |

## Suggested Files

- `src/lib/legal/constants.ts` (new)
- `src/lib/constants.ts` — derive email sender from legal constants
- `src/app/(legal)/*.tsx` — use `LEGAL_WEB_URL`
- `README.md` — deployment + domain section
- `.env.example` — comment on `NEXT_PUBLIC_APP_URL`

## Testing

- No unit tests for domain ops.
- Smoke test email + Stripe on staging hostname before switching DNS to production if possible.

## Manual Verification

1. Production site opens at chosen domain with valid TLS.
2. Transactional email From header uses verified domain.
3. Reservation confirmation email links resolve to production host (not localhost or resend.dev).
4. No remaining `napmmit.com` in user-facing production strings unless intentionally kept as redirect.
5. `bun build` passes after constant refactor.

## Acceptance Criteria

- Production domain registered and serving the app over HTTPS.
- Resend sending domain verified; production emails use custom From address.
- Stripe live webhook configured on production URL.
- `NEXT_PUBLIC_APP_URL` matches production hostname in Vercel production env.
- Hardcoded `napmmit.com` references updated or centralized behind legal constants.
- Deployment steps documented in README.

## Implementation Notes

- Do not commit secrets; only document variable names.
- Keep `onboarding@resend.dev` for local/preview until domain verified.
- Coordinate with terms-of-use and privacy-policy specs for domain string updates in the same PR window as DNS cutover if possible.

## Open Decisions

- Final domain: `napmmit.sk` vs `napmmit.com` vs both with redirect.
- Whether `www` is canonical or apex.
