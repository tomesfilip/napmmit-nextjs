# Edit Flow Cottage Ownership (P0 §4)

## Overview

The edit cottage flow loads any cottage by ID and pre-fills the create form without verifying that the current user owns it (or is admin). Server actions `updateCottage` and `deleteCottage` already enforce ownership via `cottageOwnershipFilter()` in `src/lib/cottage/actions.ts`, but the edit UI still leaks cottage data to unauthorized users.

Reference: `docs/production-readiness-audit.md` — P0 §4.

## Goal

A user may only enter the edit flow for cottages they own. Admins may edit any cottage. Everyone else receives a redirect or `notFound()` — not a pre-filled form with another owner's data.

## Scope

- Add ownership verification before loading cottage data into the edit form.
- Reuse the same ownership rules as `cottageOwnershipFilter()` in cottage actions.
- Apply the check on the server (layout or a dedicated server loader), not only in the client `useEffect`.
- Add unit tests for the ownership query/helper.

## Out Of Scope

- Changing `updateCottage` / `deleteCottage` ownership logic (already fixed — P0 §1–2).
- Admin UI for listing all cottages.
- Optimistic UI for unauthorized access (redirect is enough).

## Current State

- `src/app/edit/[id]/layout.tsx` — requires login only; no cottage ownership check.
- `src/app/edit/[id]/page.tsx` — client component calls `getCottage(cottageId)` with no user context; on success, hydrates `useCreateFormStore` and redirects to step one.
- `getCottage` in `src/server/db/queries` returns any cottage by ID.
- `cottageOwnershipFilter(cottageId, user)` in `src/lib/cottage/actions.ts`:
  - `admin` → `eq(cottages.id, cottageId)`
  - otherwise → `id = cottageId AND user_id = current user`

## Functional Requirements

### Shared ownership helper

Extract or export a reusable function, e.g. `src/lib/cottage/ownership.ts`:

```ts
export async function getCottageIfOwned(
  cottageId: number,
  user: User,
): Promise<CottageDetailType | null>;
```

Implementation must mirror `cottageOwnershipFilter` SQL semantics. Prefer a single query with the same `where` clause rather than fetch-then-compare in application code.

### Server-side gate

**Preferred approach:** Convert `src/app/edit/[id]/page.tsx` to a server component (or add a server wrapper page) that:

1. Parses and validates `id` as a positive integer; invalid → `redirect(ROUTES.DASHBOARD.INDEX)`.
2. Calls `validateRequest()`; unauthenticated → `redirect('/login')` (layout already does this; redundant check is acceptable).
3. Calls `getCottageIfOwned(cottageId, user)`.
4. If `null` → `notFound()` or `redirect(ROUTES.DASHBOARD.INDEX)` (pick one and document; `notFound()` avoids confirming cottage existence to attackers).
5. Passes cottage data to a thin client child that sets Zustand store and navigates to step one — or initialize the store via server-passed props and skip the public `getCottage` call from the browser.

**Do not** call the unscoped `getCottage` from the client for edit mode.

### Deprecate client-side `getCottage` for edit

If `getCottage` remains a server action callable from the client, add an ownership parameter and enforce it inside the action, or split into `getCottagePublic` (detail page) vs `getCottageForOwner` (dashboard/edit).

## Suggested Files

- `src/lib/cottage/ownership.ts`
- `src/lib/cottage/ownership.test.ts`
- `src/app/edit/[id]/page.tsx` — server gate + client hydration split
- Optionally `src/app/edit/[id]/edit-cottage-loader.tsx` — client-only store init

## Testing

- `getCottageIfOwned`: owner sees cottage; non-owner gets `null`; admin sees any cottage; unknown id → `null`.
- Manual: user A cannot load user B's cottage into `/edit/{id}`.

## Manual Verification

1. Log in as cottage owner A with cottage id `N`; open `/edit/N` → form loads.
2. Log in as cottage owner B; open `/edit/N` where A owns `N` → blocked (404 or dashboard redirect).
3. Log in as admin; open `/edit/N` → form loads.
4. Invalid id → dashboard redirect.
5. `bun test`, `bun lint-format`, `bun build` pass.

## Acceptance Criteria

- Unauthorized users never receive another owner's cottage fields in the edit form.
- Owners can edit their cottages end-to-end (all six steps + save).
- Admins can edit any cottage.
- Ownership helper is tested and aligned with `cottageOwnershipFilter`.
- `bun lint-format` and `bun build` pass.

## Implementation Notes

- `edit/[id]/layout.tsx` already redirects unauthenticated users; ownership belongs in the page or a server loader tied to `params.id`.
- After redirect to `/edit/{id}/step-one`, subsequent steps rely on Zustand persist — ensure unauthorized users never populate the store.
- Consider using `notFound()` instead of redirect to dashboard so enumeration is harder.
