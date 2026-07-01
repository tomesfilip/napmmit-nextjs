# Production Readiness & UX Audit

**Date:** 2026-06-28 (updated 2026-06-30)  
**Scope:** Full web app review against `README.md`, `context/project-overview.md`, `docs/project-spec.md`, and live codebase.

This document captures what is missing or incomplete before Napmmit can be considered production-ready with good UX. It complements the narrower checklist in [`what-to-fix.md`](./what-to-fix.md).

---

## Priority legend

| Priority | Meaning |
|----------|---------|
| **P0** | Blockers — security, legal, or reliability issues that must be fixed before any public launch |
| **P1** | High UX impact — hurts trust, conversion, or daily use; fix soon after P0 |
| **P2** | Important for production quality — emails, SEO, monitoring, staging, owner tooling |
| **P3** | Nice to have or post-MVP — improves the product but not required for a cautious first launch |

**Done column (P0 tables):** `Yes` = fixed (merged, or implemented on an open feature branch pending merge); `No` = still open.

---

## Executive summary

Napmmit has a solid core: cottage listing and detail pages, multi-step cottage CRUD, Lucia auth, Stripe reservation fees with webhooks, confirmation emails, and owner/hiker reservation dashboards. Profile management and guarded account deletion are relatively mature.

The gap between “features exist” and “ready for real users” is large. **P0 security holes, remaining legal gaps (production domain purchase, qualified advisor sign-off on terms and privacy policy), and rate limiting** are the main blockers. **P1 UX** (mobile nav, real listing images) matters for trust. **P2** (SEO, Sentry, develop environment, owner emails, owner calendar) should be in place before marketing push. **P3** items (price filters, admin UI, social sharing) can wait.

Guest confirmation emails now include a generated PDF (reservation summary, Napmmit fee invoice, terms appendix) with on-demand download routes — P0 §12 resolved on branch `feature/confirmation-email-pdf` (pending merge).

---

## Current state vs documented vision

| Area | Documented | Implemented today | Gap | Priority |
|------|------------|-------------------|-----|----------|
| Cottage list + search | Stage 1 | Yes — client-side search by name/area | — | — |
| Cottage detail + gallery | Stage 1 | Yes | Social sharing not implemented | P3 |
| Filtering | Stage 1 — price, location, … | Partial — mountain area + services only | No price or availability filters | P3 |
| CMS / cottage CRUD | Stage 2 | Yes — 6-step create + edit flow | No post-create availability calendar in dashboard | P2 |
| Auth (register/login/logout) | Stage 2 | Yes | Email verification not enforced for reservations | P2 |
| Confirmation emails | Stage 2 | Yes — guest confirmation + PDF attachment and download | Owner notification + cancellation emails missing | P2 |
| Reservations (RMS) | Stage 3 | Yes — Stripe fee, pending → confirmed lifecycle | No owner calendar view; pricing fields underused | P2 |
| User roles (admin/owner/hiker) | Stage 3 | Partial — roles in DB, no admin UI | Admin role unused; cottage management routes gated by role in `proxy.ts` | P3 |
| Real-time availability | project-overview | Yes — `reservation_days` strategy | Good foundation | — |
| SEO (metadata, sitemap, OG) | project-overview | Minimal root metadata only | Per-cottage metadata, sitemap, OG missing | P2 |
| Monitoring (Sentry) | project-overview | Not integrated | Errors go to `console.error` | P2 |
| Develop / staging environment | Implied by stack | Not set up | No `develop` branch, no isolated DB or staging deploy | P2 |
| Rate limiting / abuse protection | project-overview | Not implemented | Recommended before launch | P0 |
| Social sharing | README Stage 1 | Not implemented | — | P3 |
| Reviews, favorites, analytics | Future | Not started | Expected post-MVP | P3 |

---

## P0 — Must fix before launch

### Security

| # | Done | Issue | Details |
|---|------|-------|---------|
| 1 | Yes | **Cottage update has no ownership check** | ~~`updateCottage` in `src/lib/cottage/actions.ts` updates any cottage by ID.~~ Fixed: `updateCottage` uses `cottageOwnershipFilter()` — `WHERE id = ? AND user_id = ?` for owners, admin bypass for `role === 'admin'`. `userId` is excluded from the update payload so admins cannot reassign ownership. |
| 2 | Yes | **Cottage delete has no authentication or ownership check** | ~~`deleteCottage` performs destructive deletes with no `validateRequest()` and no ownership guard.~~ Fixed: `deleteCottage` calls `requireAuthenticatedUser()` and verifies ownership via `cottageOwnershipFilter()` before deleting services, images, reservations, or the cottage row. |
| 3 | Yes | **Image uploads allow anonymous access** | ~~`src/app/api/cottage-images/upload/route.ts` explicitly allows anonymous uploads.~~ Fixed: `assertCanUploadCottageImages()` in `src/lib/cottage/upload-auth.ts` runs in `onBeforeGenerateToken` — requires authenticated session; only `cottage_owner` and `admin` roles get a Blob token. Unauthenticated → 401; hikers → 403. Session cookie refresh applied on response. Covered by `upload-auth.test.ts`. |
| 4 | Yes | **Edit flow loads any cottage without ownership check** | ~~`src/app/edit/[id]/page.tsx` fetches cottage by ID and pre-fills the form with no check that the current user owns it.~~ Fixed: server page calls `getCottageIfOwned()` in `src/lib/cottage/ownership.ts` (same SQL semantics as `cottageOwnershipFilter()`); unauthorized users get `notFound()`. Client `EditCottageLoader` hydrates Zustand from server-passed data — no unscoped `getCottage` from the browser. Covered by `ownership.test.ts`. |
| 5 | Yes | **No centralized route protection** | ~~No `middleware.ts`; dashboard pages returned `null` for unauthenticated users; hikers could access `/create`.~~ Fixed: `src/proxy.ts` (Next.js 16 proxy convention) guards `/dashboard/*`, `/create/*`, `/edit/*`, and `/profile` — unauthenticated users redirect to `/login?returnUrl=...`; hikers blocked from cottage management paths via `canManageCottages()` in `src/lib/auth/roles.ts`. Safe same-origin `returnUrl` handled in login page and action (`getSafeReturnUrl`). Dashboard pages use `redirect('/login')` as defense-in-depth. Edit ownership remains a separate check (P0 §4). `/reservation/return` left public for post-payment access token flow. |
| 6 | No | **No rate limiting** | Auth endpoints, reservation checkout, and image upload are unprotected against brute-force and abuse. Recommended in `context/project-overview.md` but not built. |

### Legal & compliance

| # | Done | Issue | Details |
|---|------|-------|---------|
| 7 | Yes | **Terms of use contradict the product** | ~~`src/app/(legal)/terms-of-use/page.tsx` §2 stated the operator is *not* a reservation intermediary while the app processes paid Stripe reservations.~~ Fixed: terms rewritten in `src/app/(legal)/terms-of-use/page.tsx` — reservation facilitation role, €1 fee / €0.50 refund (from `RESERVATION_FEE_CENTS` / `RESERVATION_REFUND_CENTS`), Stripe as payment processor, pending/confirmed/cancelled lifecycle, 48h cancellation refund rule, subprocessors (Stripe, Resend, Vercel, Vercel Blob, Neon), links to privacy/cookie policies, effective date via `src/lib/legal/constants.ts`. **Before launch:** qualified Slovak legal advisor review; update `LEGAL_DOMAIN` when production domain is registered (P0 §8). |
| 8 | No | **Production domain not purchased yet** | No production domain is owned yet. The codebase and legal copy reference `napmmit.com` (e.g. terms of use, `noreply@napmmit.com` in `src/lib/constants.ts`), while `what-to-fix.md` targets `napmmit.sk` for the live site. **Buy and register the chosen domain before launch** (likely `.sk` for Slovakia-first positioning). Until then: `NEXT_PUBLIC_APP_URL` cannot point at a real production hostname; Resend cannot verify a sending domain; Stripe return URLs and webhooks need a stable public URL; legal pages, OG links, and sitemap URLs are placeholders. After purchase: configure DNS (Vercel or host), TLS, email SPF/DKIM (Resend), and update all hardcoded `napmmit.com` references in code and legal text. |
| 9 | Yes | **Privacy policy needs payment/reservation data** | ~~GDPR policy did not cover reservation data, payment metadata, or third-party processors.~~ Fixed: `src/app/(legal)/privacy-policy/page.tsx` extended — reservation/guest contact data, Stripe payment metadata (explicit no PAN/CVV), access tokens, transactional email metadata; purposes (reservations, fees/refunds, fraud prevention); legal bases; retention for reservations/payments/tokens; subprocessors (Stripe, Resend, Neon, Vercel, Vercel Blob); data subject rights with legal-retention limits; international transfers (SCCs); operator/domain via `src/lib/legal/constants.ts`. **Before launch:** qualified Slovak GDPR/privacy advisor review; update `LEGAL_DOMAIN` when production domain is registered (P0 §8). |

### Reliability

| # | Done | Issue | Details |
|---|------|-------|---------|
| 10 | Yes | **No global error boundaries** | ~~No `error.tsx` or `global-error.tsx` anywhere in `src/app/`. Failures surface as raw `<p>{error}</p>` on some pages or unhandled server errors.~~ Fixed: `src/app/error.tsx` (client route boundary with Slovak recovery UI via `ErrorFallback` + `next-intl`), `src/app/global-error.tsx` (root layout fallback with own `<html>`/`<body>` and hardcoded Slovak copy), `Error` namespace in `messages/sk.json`, retry/home/support actions, `console.error` logging with digest; production hides stack traces (digest only). Uncaught render/runtime throws now show branded UI; expected inline errors (e.g. dashboard query `ActionResponse`) unchanged. |
| 11 | Yes | **Broken empty-dashboard CTA** | ~~`src/app/dashboard/no-cottages-content.tsx` links to `create/step-one` (relative), resolving to `/dashboard/create/step-one` instead of `/create/step-one`.~~ Fixed: empty-state create link uses `ROUTES.CREATE_COTTAGE.INDEX` (`/create`) + step segment in `src/lib/constants.ts` and `no-cottages-content.tsx` (async server component, `getTranslations`). Hikers no longer land on owner-only empty state — `/dashboard` redirects to `/dashboard/reservations`; proxy blocks on `/create`/`/edit` redirect to reservations with `?notice=owner_only` and Slovak toast via `src/components/shared/route-notice.tsx`. |
| 12 | Yes | **Confirmation email PDF link is dead** | ~~`confirmation.ts` built a URL to `/reservation/{token}/confirmation.pdf` with no route.~~ Fixed (Path B — full Phase 3, branch `feature/confirmation-email-pdf`): `@react-pdf/renderer` shared generator in `src/lib/pdf/`; public route `src/app/reservation/[accessToken]/confirmation.pdf/route.ts`; authenticated route `src/app/dashboard/reservations/[id]/confirmation.pdf/route.ts`; PDF attached in `sendReservationConfirmationEmailOnce()` via Resend; download buttons on `ReservationConfirmationDetails` (post-payment + dashboard); email body notes attachment with link as fallback. **Before launch:** qualified legal/tax review of Slovak invoice wording and PDF terms appendix in `src/lib/pdf/reservation-confirmation-legal-copy.ts`. |
| 13 | Yes | **Return page depends on webhook only** | ~~If Stripe webhook does not reach the app (e.g. local dev without `stripe listen`), paid checkout completed but no reservation row was created; `/reservation/return` polled until timeout.~~ Fixed (branch `feature/confirmation-email-pdf`): `fulfillPaidCheckoutSession()` in `src/lib/stripe/fulfill-checkout-session.ts` — shared with webhook handler; return page and polling call it when DB has no row yet, retrieve paid session from Stripe API, create reservation idempotently. **Local dev:** still run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for webhook-path testing; return-page sync is a fallback, not a replacement. |

---

## P1 — UX gaps that hurt trust and conversion

### Navigation & layout

| Issue | Evidence | Impact |
|-------|----------|--------|
| No mobile navigation (hamburger menu) | `src/components/nav-header/index.tsx` — horizontal link row | Nav overflows on small screens; noted in `what-to-fix.md` |
| User email shown in header | Same file, line 43 | Long emails break layout; poor mobile UX |
| No skip-to-content link | — | Accessibility gap for keyboard users |

### Cottage discovery

| Issue | Evidence | Impact |
|-------|----------|--------|
| Listing cards always show fallback image | `src/components/cottage-card/index.tsx` — ignores `cottage.images` | Listings look identical; low click-through |
| Hardcoded Slovak empty state for no results | `no-cottage-found-content.tsx` | Inconsistent with i18n elsewhere |

### Cottage detail & reservation

| Issue | Evidence | Impact |
|-------|----------|--------|
| Only `pricePerNight` shown in reservation UI | `src/components/cottageDetail/reservation-section.tsx` | `priceLowPerNight`, breakfast/dinner prices stored but hidden |
| No “clear dates” on reservation calendar | `what-to-fix.md` | Users must manually deselect; friction |

### Hiker experience

| Issue | Evidence | Impact |
|-------|----------|--------|
| ~~Dashboard unauth returns blank page~~ | ~~`src/app/dashboard/reservations/page.tsx`~~ | Fixed via `src/proxy.ts` login redirect + page-level `redirect('/login')` defense-in-depth |
| Verify-email page in English | `src/app/(auth)/verify-email/page.tsx` — `// TODO: translations` | Breaks Slovak-first UX |

### Feedback & loading states

| Issue | Evidence | Impact |
|-------|----------|--------|
| Loading skeletons only on home + cottage detail | `src/app/loading.tsx`, `cottage/[id]/loading.tsx` | Dashboard, profile, auth, edit show plain text or nothing |
| Inconsistent toast usage | Sonner present globally; some flows use inline errors only | Uneven feedback |
| Edit page loading is “Loading...” | `src/app/edit/[id]/page.tsx` | Unpolished |
| Mixed SK/EN error messages | `src/lib/auth/actions.ts` — Slovak server errors; signup “User with this email already exists” in English | Feels unfinished |

### Accessibility

- Radix/shadcn baseline (labels, some `aria-label`s on filters).
- Gaps: no skip link, `not-found.tsx` image `alt="404"` is not descriptive, cookie settings via `window.openCookieSettings` without visible global type declaration.
- `ThemeProvider` is not mounted in `src/components/Providers.tsx` while `sonner.tsx` may call `useTheme()` — verify runtime behavior.

---

## P2 — Production quality & owner tooling

### Email & notifications

| Issue | Evidence | Impact |
|-------|----------|--------|
| Email verification not required for reservations | No `isEmailVerified` check in reservation flow | Unverified accounts can book; harder to reach guests |
| No owner notification on new reservation | No email logic in `src/lib/reservation/` for owners | Owners must poll dashboard; slow confirmations |
| Cancellation email not sent | Template at `src/lib/emailTemplates/reservation-cancelled.tsx` never imported in actions | Users get no confirmation of cancel/refund |
| Signup continues if verification email fails | `src/lib/auth/actions.ts` — only `console.error` | User may think they are verified when they are not |

Guest reservation confirmation email works (idempotent send after payment) with PDF attachment and working download routes.

### Owner calendar & availability

| Issue | Evidence | Impact |
|-------|----------|--------|
| No post-create availability calendar in dashboard | Availability only in create flow | Owners cannot block dates after listing goes live |
| No reservation calendar view | project-spec “calendar view of reservations” | Hard to see occupancy at a glance |

### SEO

Documented in `context/project-overview.md` as required for public cottage pages:

| Item | Status |
|------|--------|
| Per-cottage `generateMetadata` | Missing |
| Open Graph / Twitter cards | Missing |
| `sitemap.ts` | Missing |
| `robots.ts` | Missing |
| Structured data (LodgingBusiness, etc.) | Missing |
| Canonical URLs | Missing |

Only root metadata exists in `src/app/layout.tsx`. Cottage pages are invisible to social previews and weak for search.

### Monitoring & observability

| Item | Status |
|------|--------|
| Sentry | Mentioned in docs; not in `package.json` |
| Structured logging | Mostly `console.error` |
| Email delivery tracking | Partial — `confirmationEmailSentAt` on reservations |
| Uptime / health checks | Not configured |
| CI pipeline | No `.github/workflows` |

### Develop branch & staging environment (not set up)

Today the repo has `main` and short-lived feature branches only — no long-lived `develop` branch and no dedicated non-production deployment. Local `.env.local` is the only environment most work runs against.

**Recommended setup before production:**

| Layer | Production | Develop / staging |
|-------|------------|-------------------|
| Git | `main` — protected, deploy on merge | `develop` — integration branch; feature branches merge here first |
| Hosting | Vercel production project or prod env | Vercel preview linked to `develop`, or separate Vercel project (e.g. `dev.napmmit.sk`) |
| Database | Neon `main` branch | **Separate Neon branch** (e.g. `develop`) — never point staging at prod `DATABASE_URL` |
| App URL | `NEXT_PUBLIC_APP_URL` → production domain | Distinct URL (Vercel preview hostname or `dev.` subdomain) |
| Stripe | Live mode keys + live webhook endpoint | **Test mode** keys + test webhook pointing at develop URL |
| Email (Resend) | Verified production domain | Test sender or Resend sandbox; do not email real users from develop |
| Blob storage | Production Vercel Blob store | Separate store or prefix so test uploads do not pollute prod |
| Secrets | Vercel Production env vars | Vercel Preview / Development env vars — separate from prod |

**Minimum checklist:**

1. Create Neon `develop` branch; store its connection string only in develop/staging env vars.
2. Create and protect `develop` in Git; document flow: feature → `develop` → `main` (per `context/ai-interaction.md`).
3. Configure Vercel (or host) so pushes to `develop` deploy to a stable staging URL with develop env vars.
4. Register Stripe **test** webhook for staging URL (`/api/webhooks/stripe`).
5. Run migrations against develop DB after each schema change; smoke-test before promoting to `main`.
6. Document which env file / Vercel environment maps to local vs develop vs production in README.

### Release & deployment docs

`README.md` only documents `bun dev`. Missing:

- Copy `.env.example` → `.env.local` and document all 9 variables
- `bun db:migrate` and optional `bun db:seed`
- Local Stripe webhook: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Resend domain verification for production sender (blocked until domain is owned — P0 §8)
- `bun build`, `bun start`, `bun test`, `bun lint-format`
- Deployment notes (Vercel + Neon + Blob per stack in project-overview)

### Security headers

`next.config.mjs` sets `Referrer-Policy` only on `/reservation/:accessToken`. Missing: CSP, HSTS, `X-Frame-Options`, `Permissions-Policy` (recommended for production).

### Testing gaps

| Type | Count / status |
|------|----------------|
| Unit tests (Vitest) | 25+ files under `src/lib/` and route handlers |
| Component tests | None |
| E2E (Playwright/Cypress) | None |
| API / webhook integration tests | None |

Well-tested: reservation validation, payment status, confirmation email idempotency (+ PDF attachment), account deletion guards, cottage image upload auth, route protection role helper (`canManageCottages`), safe return URL validation, cottage edit-flow ownership (`getCottageIfOwned`), PDF filename/invoice/legal copy helpers, public and dashboard PDF route guards, checkout session fulfillment fallback (`fulfillPaidCheckoutSession`).  
Untested: auth actions, cottage CRUD, Stripe webhook handler end-to-end, all UI flows.

---

## P3 — Post-MVP & lower priority

### Search & discovery

| Issue | Evidence | Impact |
|-------|----------|--------|
| Price filter missing | README Stage 1; `src/components/side-filters.tsx` has area + services only | Users cannot filter by budget |
| No availability-based search on listing page | project-overview | Cannot answer “what’s free next weekend?” from home page |

### Roles & admin

| Issue | Evidence | Impact |
|-------|----------|--------|
| Admin role unused — no moderation UI | Roles in DB; no admin dashboard | Content moderation manual or absent |
| ~~Hikers can access `/create`~~ | ~~`create/layout.tsx` checked login only~~ | Fixed: `src/proxy.ts` blocks hikers from `/create` and `/edit` (P0 §5) |

### Growth & integrations

| Issue | Evidence | Impact |
|-------|----------|--------|
| Social sharing not implemented | README Stage 1 | Missed organic growth channel |
| Map is owner-pasted iframe URL | `location-section.tsx` | No Mapy.cz integration despite `MAPY_CZ_API_KEY` in `.env.example` |
| Reviews, favorites, analytics | project-overview future | Not started |

### Housekeeping

| Issue | Evidence | Impact |
|-------|----------|--------|
| Stale dashboard TODO | `src/app/dashboard/TODO.md` | Misleading for contributors; most items are done |
| Route constants drift | `ROUTES.AUTH.FORGOT_PASSWORD` → `/forgot-password`; actual page is `/reset-password` | Latent bug if constant is wired up |
| Multi-country i18n | `src/i18n/request.ts` — Slovak only | Czech, Polish, etc. not started |

---

## Feature completeness checklist

### README Stage 1

- [x] List of cottages
- [x] Filtering (partial — area, services)
- [x] Search (name, mountain area)
- [x] Cottage detail (gallery, contact, occupancy)
- [ ] Social sharing — **P3**
- [ ] Price filter — **P3**

### README Stage 2

- [x] Cottage CMS (CRUD + multi-step UI)
- [x] Register, login, logout
- [x] Confirmation email (guest) with PDF — **P2** for owner + cancellation gaps

### README Stage 3

- [x] Reservations management (hiker + owner dashboards, confirm/cancel)
- [ ] User roles fully enforced — **P3** (admin UI); cottage management role gate done (**P0** §5)

### project-overview MVP (Phase 1)

- [x] Authentication
- [x] Cottage listings
- [x] Reservations + Stripe fee
- [x] Owner dashboard
- [x] Email confirmations (guest)
- [ ] Owner booking notifications — **P2**
- [ ] Email verification enforced for reservations — **P2**

### project-overview MVP (Phase 2)

- [ ] Calendar management (post-create) — **P2**
- [ ] Advanced filters — **P3**
- [ ] Admin moderation — **P3**
- [ ] Analytics — **P3**

---

## Email notification matrix

| Email | Template | Sent? | Priority |
|-------|----------|-------|----------|
| Email verification OTP | Yes | Yes | — |
| Password reset | Yes | Yes | — |
| Reservation confirmed (guest) | Yes | Yes (idempotent) + PDF attachment | — |
| Reservation cancelled | Yes | **No** — template unused | **P2** |
| Owner: new reservation | No | **No** | **P2** |
| Account deletion confirmation | Yes | Yes | — |

---

## i18n status

- Framework: `next-intl` with Slovak-only locale hardcoded in `src/i18n/request.ts`.
- `messages/sk.json` is substantial (~400+ keys including email templates).
- Gaps (mostly **P1**): verify-email page, mixed hardcoded SK/EN in server actions and some components, auth metadata titles in English.
- Legal pages: inline Slovak JSX, not in message files.
- Multi-country expansion: **P3**.

---

## Recommended remediation order

### Phase 1 — P0 blockers

1. ~~Add ownership checks to `updateCottage`, `deleteCottage`, and edit flow (`/edit/[id]`)~~ — **done** (`cottageOwnershipFilter` / `getCottageIfOwned` in `src/lib/cottage/ownership.ts`).
2. ~~Authenticate image upload route~~ — **done** (`assertCanUploadCottageImages` in `src/lib/cottage/upload-auth.ts`).
3. ~~Add centralized route protection (`proxy.ts`)~~ — **done** (`src/proxy.ts`: login redirect for protected routes; `canManageCottages()` role gate for `/create` and `/edit`).
4. ~~Fix broken dashboard create CTA link~~ — **done** (`CREATE_COTTAGE.INDEX`, `no-cottages-content.tsx`, hiker redirect + `RouteNotice` toast).
5. ~~Update terms of use~~ — **done** (`src/app/(legal)/terms-of-use/page.tsx`, `src/lib/legal/constants.ts`).
6. ~~Update privacy policy for reservations and payment processors~~ — **done** (`src/app/(legal)/privacy-policy/page.tsx`, aligned with terms and `src/lib/legal/constants.ts`).
7. ~~Add `error.tsx` (and optionally `global-error.tsx`)~~ — **done** (`src/app/error.tsx`, `src/app/global-error.tsx`, `src/components/error/error-fallback.tsx`, `messages/sk.json` `Error` namespace).
8. **Buy production domain** (P0 §8), then DNS, Resend verification, `NEXT_PUBLIC_APP_URL`, update `LEGAL_DOMAIN` in `src/lib/legal/constants.ts`.
9. ~~Implement or remove confirmation email PDF link (P0 §12)~~ — **done** on `feature/confirmation-email-pdf` (full PDF: `src/lib/pdf/`, routes, email attachment, UI download).
10. ~~Return-page checkout fulfillment fallback when webhook is delayed (P0 §13)~~ — **done** on `feature/confirmation-email-pdf` (`src/lib/stripe/fulfill-checkout-session.ts`).
11. Add rate limiting (P0 §6).

### Phase 2 — P1 UX

12. Show real cottage images on listing cards.
13. Mobile hamburger navigation.
14. Loading skeletons on dashboard, profile, auth routes.
15. i18n sweep (verify-email, auth errors, empty states).
16. Reservation calendar “clear dates” button.

### Phase 3 — P2 production quality

17. Wire owner notification email on new reservation.
18. Wire cancellation confirmation email.
19. Enforce email verification before reservation.
20. Owner calendar + post-create availability management in dashboard.
21. Per-cottage `generateMetadata` + OG tags; `sitemap.ts` and `robots.ts`.
22. Integrate Sentry.
23. Set up develop environment: `develop` Git branch, Neon develop DB, Vercel staging deploy, test-mode Stripe webhook, separate env vars.
24. Add CI: `bun test`, `bun lint-format`, `bun build`.
25. Expand README with env setup, migrations, Stripe webhook, and deploy steps.

### Phase 4 — P3 (post-launch)

- Price and availability filters on home page
- Admin moderation UI
- Social sharing on cottage detail
- Mapy.cz integration for location picker
- E2E tests for critical flows
- Reviews, favorites, analytics

---

## Related documents

| Document | Relevance |
|----------|-----------|
| [`what-to-fix.md`](./what-to-fix.md) | Pre-launch UX items (loading skeletons, mobile nav, calendar clear, `.sk` domain) |
| [`project-spec.md`](./project-spec.md) | Feature spec and business rules |
| [`reservations.md`](./reservations.md) | Reservation lifecycle detail |
| [`context/project-overview.md`](../context/project-overview.md) | Vision, architecture, MVP phases |
| [`reservation-confirmed-phase-3-pdf-spec.md`](../context/features/reservation-confirmed-phase-3-pdf-spec.md) | PDF confirmation spec (P0 §12) |
| [`README.md`](../README.md) | Stage 1–3 feature list (partially outdated) |

---

## Summary

Napmmit is past prototype stage for reservations and cottage management, but **not production-ready**.

| Priority | Focus |
|----------|-------|
| **P0** | Rate limiting, production domain; terms and privacy policy drafted (qualified legal/GDPR advisor sign-off before launch); PDF invoice/terms appendix in confirmation PDF needs same legal review |
| **P1** | Listing images, mobile nav, loading states, i18n polish |
| **P2** | Owner/guest emails, owner calendar, SEO, Sentry, develop/staging environment, CI |
| **P3** | Price/availability filters, admin UI, social sharing, analytics |

Treat this audit as a living backlog: mark items done in PRs and revisit before any public launch or marketing push.
