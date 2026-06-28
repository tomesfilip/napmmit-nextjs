# Cottage Image Upload Authentication (P0 §3)

## Overview

Secure the Vercel Blob client upload route so only authenticated users can obtain upload tokens. Today `src/app/api/cottage-images/upload/route.ts` generates Blob tokens for anonymous callers, which allows storage abuse and uncontrolled cost.

Reference: `docs/production-readiness-audit.md` — P0 §3.

## Goal

Only logged-in users who are allowed to manage cottages may upload images to Blob storage. Anonymous or unauthorized requests must be rejected before a client upload token is issued.

## Scope

- Authenticate the caller in `onBeforeGenerateToken` using the existing Lucia session pattern.
- Authorize uploads for authenticated users (minimum: any logged-in user during create/edit; preferred: `cottage_owner` or `admin` only).
- Return `401` when unauthenticated and `403` when authenticated but not permitted.
- Add focused tests for the auth guard logic (extracted helper if needed).
- Update inline comments that currently acknowledge anonymous uploads.

## Out Of Scope

- Scanning uploaded images for malware or content moderation.
- Per-cottage upload quotas beyond existing `MAX_IMAGES_PER_COTTAGE` client validation.
- Migrating or deleting blobs uploaded anonymously before this fix.
- Rate limiting on the upload route (covered separately in `context/features/rate-limiting-spec.md`).

## Current State

- Route: `src/app/api/cottage-images/upload/route.ts`.
- `onBeforeGenerateToken` returns token config with `allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp']` and no auth check.
- Comment explicitly states: "Otherwise, you're allowing anonymous uploads."
- Cottage create/edit UI uses `@vercel/blob/client` `upload()` against this route.
- `create/layout.tsx` and `edit/[id]/layout.tsx` require login for the UI, but the API route is callable directly without a session.

## Functional Requirements

### Session validation in API route

In `onBeforeGenerateToken`:

1. Resolve the current user from the request cookies using the same Lucia session validation used elsewhere (`validateRequest` or an API-safe equivalent that reads cookies from `request`).
2. If no valid session → throw or return an error that results in `401 Unauthorized`.
3. If user role is not `cottage_owner` or `admin` → reject with `403 Forbidden`.

Extract `assertCanUploadCottageImages(request): Promise<User>` to `src/lib/cottage/upload-auth.ts` (or similar) so the guard is unit-testable without mocking the full Vercel Blob handler.

### Token payload (optional but recommended)

Include `userId` in `tokenPayload` JSON so `onUploadCompleted` can audit uploads later:

```ts
tokenPayload: JSON.stringify({ userId: user.id }),
```

Do not trust client-supplied `clientPayload` for authorization decisions.

### Error responses

- Unauthenticated: `401` with a generic message (no stack traces).
- Wrong role: `403`.
- Preserve existing `400` behavior for malformed Blob handshake bodies.

### Client behavior

No UI changes required if create/edit layouts already require login. Verify that:

- Logged-in cottage owners can still complete the multi-step create flow and edit flow image steps.
- Upload failures due to auth show a sensible error in the existing image upload component (toast or inline).

## Suggested Files

- `src/app/api/cottage-images/upload/route.ts` — wire auth guard
- `src/lib/cottage/upload-auth.ts` — `assertCanUploadCottageImages`
- `src/lib/cottage/upload-auth.test.ts` — role and session edge cases

## Testing

- Unit test `assertCanUploadCottageImages` with mocked session: no user → throws/401; hiker → 403; cottage_owner → allowed; admin → allowed.
- Manual: `curl -X POST` the upload route without cookies → 401.

## Manual Verification

1. Log out; attempt image upload from create flow (or direct API call) → rejected.
2. Log in as hiker; attempt upload → rejected with 403.
3. Log in as cottage owner; upload JPEG/PNG/WebP in create step → succeeds.
4. Log in as admin; upload succeeds.
5. `bun test`, `bun lint-format`, `bun build` pass.

## Acceptance Criteria

- Anonymous requests cannot obtain Blob upload tokens.
- Hikers cannot obtain Blob upload tokens.
- Cottage owners and admins can upload images through the existing UI.
- Auth guard has unit test coverage.
- `bun lint-format` and `bun build` pass.

## Implementation Notes

- API routes cannot use the React `cache()`-wrapped `validateRequest` if it assumes Next.js server component context; use Lucia's `lucia.validateSession` with cookies from `request.headers` or extract a shared `validateRequestFromRequest(request: Request)` helper.
- Authorization at token generation time is sufficient for P0; linking uploaded blobs to a specific `cottageId` at upload time is optional because images are associated with cottages only when `createCottage` / `updateCottage` persists `images` rows.

## Open Decisions

- Whether hikers who somehow reach upload should get `403` vs allowing any authenticated user (product: only owners create cottages — prefer `cottage_owner | admin`).
