# Centralized Route Protection Middleware (P0 §5)

## Overview

Napmmit has no `middleware.ts`. Protected routes rely on per-page `validateRequest()` calls with inconsistent behavior: dashboard pages return `null` for unauthenticated users instead of redirecting to login; `/create` requires login but not the `cottage_owner` role, so hikers can start cottage creation.

Reference: `docs/production-readiness-audit.md` — P0 §5.

## Goal

Enforce authentication and role-based access in one place so protected routes always redirect unauthenticated users to login and restrict cottage management routes to `cottage_owner` and `admin`.

## Scope

- Add `src/middleware.ts` using Next.js middleware matcher.
- Redirect unauthenticated visitors from protected paths to `/login` with optional `returnUrl` query param.
- Restrict `/create` and `/edit/*` to users with role `cottage_owner` or `admin`.
- Align dashboard routes (`/dashboard`, `/dashboard/reservations`, `/dashboard/reservations/*`) with login redirect instead of blank pages.
- Keep `/profile` protection consistent (already redirects in page — middleware can duplicate for consistency).
- Document protected route list in this spec.

## Out Of Scope

- Email verification enforcement on protected routes (P2).
- Admin moderation UI or separate admin route namespace.
- CSRF tokens (future hardening).
- Rate limiting (see `context/features/rate-limiting-spec.md`).

## Current State

| Route | Current guard | Problem |
|-------|---------------|---------|
| `/dashboard` | `validateRequest`; `if (!user) return null` | Blank page |
| `/dashboard/reservations` | Same pattern | Blank page |
| `/create/*` | Layout redirects if no user | Hikers allowed |
| `/edit/*` | Layout redirects if no user | No role check; no ownership (see edit-flow spec) |
| `/profile` | Page redirects if no user | Works but ad hoc |
| Public routes | None | Correct |

User roles in schema: `hiker`, `cottage_owner`, `admin`.

## Functional Requirements

### Middleware file

Create `src/middleware.ts`:

```ts
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/edit/:path*',
    '/profile',
  ],
};
```

Extend matcher if other authenticated-only routes exist.

### Authentication redirect

For matched routes, if session is invalid or missing:

- Redirect to `/login?returnUrl=${encodeURIComponent(pathname)}` (or project-standard query key).
- Do not render the route or return `null`.

Use Lucia session validation compatible with Edge middleware (read session cookie, validate with Lucia — follow Lucia + Next.js middleware docs for this project's adapter).

### Role gate for cottage management

For paths matching `/create` or `/edit`:

- If authenticated but `user.role === 'hiker'` → redirect to `/dashboard` or a dedicated "not authorized" page with Slovak copy.
- Allow `cottage_owner` and `admin`.

### Interaction with page-level checks

After middleware ships:

- Remove redundant `return null` unauth branches from dashboard pages; prefer `redirect('/login')` in server components only as defense-in-depth, or rely on middleware alone for those paths.
- Keep ownership checks in edit flow and server actions — middleware does not replace resource-level authorization.

### Login redirect after auth

Optional P0 enhancement: after successful login, read `returnUrl` and redirect there if same-origin and safe (no open redirect).

## Suggested Files

- `src/middleware.ts`
- `src/lib/auth/middleware-session.ts` — Edge-safe session read/validate helper
- `src/app/dashboard/page.tsx` — remove `return null` for unauth
- `src/app/dashboard/reservations/page.tsx` — same
- `messages/sk.json` — optional `Unauthorized.Role` message if using a dedicated page

## Testing

- Unit test role helper: `canManageCottages(role)` → true for `cottage_owner`, `admin`; false for `hiker`.
- Middleware integration tests are optional; manual verification is acceptable for P0.

## Manual Verification

1. Log out; visit `/dashboard` → redirect to `/login`.
2. Log out; visit `/dashboard/reservations` → redirect to `/login`.
3. Log in as hiker; visit `/create/step-one` → blocked (redirect).
4. Log in as cottage_owner; visit `/create/step-one` → allowed.
5. Log in as admin; visit `/create/step-one` → allowed.
6. Log in; visit `/profile` → allowed.
7. `bun build` passes (middleware compiles for Edge).

## Acceptance Criteria

- No protected route renders a blank page for unauthenticated users.
- Hikers cannot access `/create` or `/edit` paths.
- Cottage owners and admins can access cottage management routes.
- Session validation runs in middleware for all matcher paths.
- `bun lint-format` and `bun build` pass.

## Implementation Notes

- Lucia middleware validation must use the same cookie name and session table as server components.
- Middleware cannot access Node-only DB drivers if validation is DB-backed; use Lucia's session cookie validation pattern supported on Edge.
- `/edit` ownership remains a separate P0 (edit-flow-ownership-spec) — middleware only checks role, not cottage id.

## Open Decisions

- Redirect hikers from `/create` to `/dashboard` vs `/` vs a static "owners only" page.
- Whether to protect `/reservation/return` (post-payment) — currently may use access token; leave public unless product requires login.
