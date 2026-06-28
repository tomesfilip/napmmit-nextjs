# Global Error Boundaries (P0 §10)

## Overview

The App Router has no `error.tsx` or `global-error.tsx`. Uncaught errors in server components or client trees surface as raw messages (`<p>{error}</p>` on some pages) or generic Next.js error pages — poor UX and no recovery path for users.

Reference: `docs/production-readiness-audit.md` — P0 §10.

## Goal

Provide branded, user-friendly error UI with a recovery action (retry or go home) for route-level failures, and a root fallback for catastrophic layout errors.

## Scope

- Add `src/app/error.tsx` — route segment error boundary (client component).
- Add `src/app/global-error.tsx` — root layout failure boundary.
- Add targeted `error.tsx` for high-traffic or fragile routes if the root boundary is insufficient.
- Slovak copy via `next-intl` where practical.
- Log errors server-side (`console.error` minimum; Sentry is P2).

## Out Of Scope

- Sentry integration (P2).
- Custom `not-found.tsx` redesign (separate from error boundaries).
- Per-component try/catch for expected validation errors (keep inline form errors).

## Current State

- No `error.tsx` or `global-error.tsx` under `src/app/`.
- `src/app/dashboard/page.tsx` renders `{error && <p>{error}</p>}` for query failures.
- Other pages may throw or show unstyled errors.
- `src/app/not-found.tsx` exists for 404.

## Functional Requirements

### Root `src/app/error.tsx`

Next.js requirements:

- Must be a Client Component (`'use client'`).
- Receives `error: Error & { digest?: string }` and `reset: () => void`.

UI:

- Friendly title (Slovak): e.g. "Niečo sa pokazilo"
- Short explanation without leaking stack traces or internal messages in production.
- **Skúsiť znova** button calling `reset()`.
- Link to home `/`.
- Optional link to support email from `EMAIL_SUPPORT` in constants.
- Match Napmmit layout typography (Card or centered column).

Log `error.digest` and message via `useEffect` + `console.error` (Sentry hook point later).

### `src/app/global-error.tsx`

- Wraps root layout failures (including broken `layout.tsx`).
- Must include own `<html>` and `<body>` per Next.js docs.
- Minimal styling (inline or bare CSS) — cannot rely on broken Providers/theme.
- Same Slovak messaging and home link.

### Optional segment boundaries

Consider nested `error.tsx` for:

- `src/app/dashboard/error.tsx` — owner/hiker dashboard queries
- `src/app/cottage/[id]/error.tsx` — public detail page
- `src/app/(auth)/error.tsx` — auth flows

P0 minimum is root + global only; add segment files if time permits in same PR.

### Production vs development

In `development`, optionally show `error.message` in a collapsible `<details>` for debugging.

In `production`, show only generic copy + digest id for support tickets.

### Translations

Add `messages/sk.json` keys under `Error`:

- `Title`, `Description`, `Retry`, `GoHome`, `Support`

Use `useTranslations` in client error components.

## Suggested Files

- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/app/dashboard/error.tsx` (optional)
- `messages/sk.json` — `Error` namespace

## Testing

- No unit tests required for P0.
- Manual: throw test error in a dev-only route or temporary button.

## Manual Verification

1. Trigger error in a server component on `/dashboard` → error boundary UI, not blank page.
2. Click retry → attempts re-render.
3. Home link navigates to `/`.
4. Global boundary: temporarily break root layout in dev → global-error renders html/body.
5. Production build does not expose stack traces in UI.
6. `bun lint-format`, `bun build` pass.

## Acceptance Criteria

- `error.tsx` exists at app root and renders Slovak recovery UI.
- `global-error.tsx` exists for root layout failures.
- Users see branded error UI instead of raw `<p>{error}</p>` for uncaught errors.
- Retry and home navigation work.
- `bun lint-format` and `bun build` pass.

## Implementation Notes

- Error boundaries do not catch errors in Server Actions — those still return `ActionResponse` errors; this spec is for render/runtime throws.
- `global-error.tsx` cannot use `next-intl` provider if the provider itself failed — use hardcoded Slovak strings or a minimal inline fallback.
- Replace dashboard `<p>{error}</p>` with throwing or returning a proper error component only if query failure should trigger boundary; otherwise keep graceful inline empty state for expected DB errors.

## Open Decisions

- Whether dashboard query errors should use boundary vs inline empty state (prefer inline for expected "no data" vs throw for unexpected).
