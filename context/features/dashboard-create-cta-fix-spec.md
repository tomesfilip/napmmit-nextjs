# Dashboard Empty State Create CTA Fix (P0 §11)

## Overview

When a cottage owner has no listings, the dashboard empty state links to `create/step-one` as a relative URL. From `/dashboard`, that resolves to `/dashboard/create/step-one` (404) instead of `/create/step-one`.

Reference: `docs/production-readiness-audit.md` — P0 §11.

## Goal

The "Create cottage" button on the empty dashboard must navigate to the first step of the cottage creation flow at `/create/step-one`.

## Scope

- Fix the `Link` href in `src/app/dashboard/no-cottages-content.tsx`.
- Use the existing `ROUTES` constant pattern for maintainability.
- Verify no other dashboard links use the same relative-path mistake.

## Out Of Scope

- Redesigning the empty state UI.
- Auto-redirecting new owners to create flow without clicking.

## Current State

```tsx
// src/app/dashboard/no-cottages-content.tsx
<Link
  href={`create/${ROUTES.CREATE_COTTAGE.STEP_ONE}`}
  ...
>
```

`ROUTES.CREATE_COTTAGE.STEP_ONE` is `'step-one'` (relative segment only).

There is no `ROUTES.CREATE` root constant today — `ROUTES.EDIT_COTTAGE` is `/edit` but create path is implicit `/create`.

## Functional Requirements

### Fix href

Use an absolute path:

```tsx
href={`/create/${ROUTES.CREATE_COTTAGE.STEP_ONE}`}
```

**Preferred:** Add to `src/lib/constants.ts`:

```ts
CREATE_COTTAGE: {
  INDEX: '/create',
  STEP_ONE: 'step-one',
  // ... existing step keys stay as segments for progress bar
},
```

Then:

```tsx
href={`${ROUTES.CREATE_COTTAGE.INDEX}/${ROUTES.CREATE_COTTAGE.STEP_ONE}`}
```

Or a helper:

```ts
CREATE_COTTAGE_STEP: (step: string) => `/create/${step}`,
```

### Audit other links

Grep for `href={\`create/` and `href="create/` under `src/` — fix any similar relative links from nested routes.

## Suggested Files

- `src/app/dashboard/no-cottages-content.tsx`
- `src/lib/constants.ts` — optional `CREATE_COTTAGE.INDEX`

## Testing

- Optional component test with rendered link href assertion.
- Manual verification is sufficient for P0.

## Manual Verification

1. Log in as cottage owner with zero cottages.
2. Open `/dashboard`.
3. Click create button → lands on `/create/step-one`, not 404.
4. Progress bar and step one form load normally.
5. `bun lint-format`, `bun build` pass.

## Acceptance Criteria

- Empty dashboard CTA navigates to `/create/step-one`.
- No relative `create/...` links remain on dashboard routes.
- `bun lint-format` and `bun build` pass.

## Implementation Notes

- One-line fix is acceptable without new constants if YAGNI — but adding `CREATE_COTTAGE.INDEX` prevents recurrence.
- `NoCottagesContent` is a client component (`useTranslations`); `Link` from `next/link` works unchanged.
