# Confirmation Email PDF Dead Link (P0 §12)

## Overview

`sendReservationConfirmationEmailOnce()` in `src/lib/reservation/confirmation.ts` builds `pdfUrl` pointing to `/reservation/{accessToken}/confirmation.pdf`. No route implements that path. Guests receive a broken link in the reservation confirmation email.

Reference: `docs/production-readiness-audit.md` — P0 §12.

Full PDF implementation is specified in `context/features/reservation-confirmed-phase-3-pdf-spec.md`. This P0 spec defines the **launch blocker** resolution: minimum fix vs full Phase 3.

## Goal

Guests must not receive dead links in transactional email. Either remove the PDF link until PDF generation ships, or implement the PDF route and attachment per Phase 3.

## Scope

Two acceptable paths — **pick one before implementation:**

### Path A — Minimum P0 (ship without PDF)

- Remove `pdfUrl` from confirmation email rendering when no route exists.
- Update `getConfirmationEmailUrls()` and `src/lib/emailTemplates/reservation-created.tsx` to omit PDF button/link.
- Keep confirmation page link (`/reservation/return` or dashboard) as primary CTA.
- Update tests in `src/lib/reservation/confirmation.test.ts` (if any) for URL shape.

### Path B — Full fix (implement Phase 3)

- Implement `context/features/reservation-confirmed-phase-3-pdf-spec.md`.
- Add `src/app/reservation/[accessToken]/confirmation.pdf/route.ts`.
- Attach PDF to email; link becomes fallback per Phase 3 spec.

**P0 launch recommendation:** Path A unblocks launch quickly; Path B if legal/product requires PDF at launch.

## Out Of Scope (Path A)

- `@react-pdf/renderer` dependency.
- Dashboard PDF download button.
- Legal appendix in PDF.

## Current State

- `getConfirmationEmailUrls()` sets:
  ```ts
  pdfUrl = `${appUrl}/reservation/${summary.accessToken}/confirmation.pdf`
  ```
- `renderReservationCreatedEmail` includes PDF CTA when `pdfUrl` is defined.
- Phase 2 confirmation page explicitly deferred PDF (`reservation-confirmed-phase-2-confirmation-page-spec.md`).
- No `confirmation.pdf` route under `src/app/reservation/`.

## Functional Requirements

### Path A — Remove dead link

1. **`src/lib/reservation/confirmation.ts`**
   - Remove `pdfUrl` from `getConfirmationEmailUrls()` return value, or return `undefined` always until Phase 3.
2. **`src/lib/emailTemplates/reservation-created.tsx`**
   - Remove or hide PDF download button when `pdfUrl` is absent.
   - Ensure email still shows reservation summary, dates, cottage contact, and link to confirmation page / dashboard.
3. **Translations**
   - Remove unused PDF email strings or keep for Phase 3 behind feature flag.
4. **Tests**
   - Assert confirmation email props do not include `pdfUrl` when Path A active.

### Path B — Implement PDF (summary)

Follow Phase 3 spec in full:

| Deliverable | File |
|-------------|------|
| PDF renderer | `src/lib/pdf/render-reservation-confirmation-pdf.ts` |
| Public route | `src/app/reservation/[accessToken]/confirmation.pdf/route.ts` |
| Email attachment | `sendMail` attachments + `confirmation.ts` |
| UI download | `reservation-confirmation-details.tsx` |

Path B satisfies P0 §12 and supersedes Path A.

### Regression

- Idempotent `sendReservationConfirmationEmailOnce()` behavior unchanged.
- `confirmationEmailSentAt` still set only on successful send.
- HTML email still renders when PDF is removed.

## Suggested Files (Path A)

- `src/lib/reservation/confirmation.ts`
- `src/lib/emailTemplates/reservation-created.tsx`
- `src/lib/reservation/confirmation.test.ts` (update)
- `messages/sk.json` — optional cleanup

## Suggested Files (Path B)

See `context/features/reservation-confirmed-phase-3-pdf-spec.md` — Suggested Files section.

## Testing

- Path A: unit test — `getConfirmationEmailUrls` does not return `pdfUrl`.
- Path B: Phase 3 unit tests (filename helper, route 404, attachment).

## Manual Verification

### Path A

1. Complete a test reservation with Stripe test mode.
2. Receive confirmation email.
3. Confirm no PDF link or button appears (or button hidden).
4. Confirmation page / dashboard link still works.
5. Clicking old bookmark to `confirmation.pdf` → 404 is acceptable until Phase 3.

### Path B

1. Email contains PDF attachment and/or working `confirmation.pdf` link.
2. Link returns `application/pdf` with valid content.
3. Duplicate webhook does not send duplicate emails.

## Acceptance Criteria

- **Path A:** No dead PDF hyperlink in production confirmation emails.
- **Path B:** PDF route exists, returns valid PDF, email link and/or attachment works.
- Confirmation email send idempotency preserved.
- `bun test`, `bun lint-format`, `bun build` pass.

## Implementation Notes

- Path A is a small PR suitable for Phase 1 P0 batch; Path B is a larger feature branch.
- Audit mentions "can ship with removal" in remediation order — default recommendation is Path A unless legal requires invoice PDF at launch.
- After Path A, reopen Phase 3 as P2/P1 enhancement; update audit Done column when resolved.

## Open Decisions

- **Path A vs Path B** — product/legal owner decision before sprint.
- If Path A: whether to remove `pdfUrl` parameter entirely from email template or leave optional for Phase 3.
