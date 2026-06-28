# Rate Limiting for Abuse-Sensitive Routes (P0 §6)

## Overview

Auth endpoints, reservation checkout, and image upload have no rate limiting. The stack is vulnerable to brute-force login attempts, signup spam, checkout session flooding, and anonymous Blob token abuse (until upload auth is fixed).

Reference: `docs/production-readiness-audit.md` — P0 §6; `context/project-overview.md` (Recommended Additions).

## Goal

Add proportionate rate limits on abuse-sensitive server entry points before public launch, with clear HTTP `429` responses and minimal impact on legitimate users.

## Scope

- Rate limit authentication-related server actions and/or API routes.
- Rate limit Stripe checkout session creation.
- Rate limit cottage image upload token generation.
- Use a solution compatible with Vercel serverless (prefer `@upstash/ratelimit` + Redis or Vercel KV if available; document env vars).
- Centralize limit configuration in one module.
- Return consistent `429` with `Retry-After` when possible.

## Out Of Scope

- WAF or CDN-level DDoS protection (Vercel/platform concern).
- CAPTCHA or bot detection.
- Per-IP blocking lists or admin dashboards.
- Rate limiting public cottage listing pages.

## Current State

- Auth: `src/lib/auth/actions.ts` — login, signup, password reset, verify email (server actions, no limits).
- Checkout: `src/app/actions/stripe.ts` — `createCheckoutSession` (authenticated).
- Upload: `src/app/api/cottage-images/upload/route.ts` — POST (anonymous today).
- No `@upstash/ratelimit`, `rate-limiter-flexible`, or similar in `package.json`.
- No `middleware.ts` yet (see route-protection spec — limits can live in middleware and/or per-handler).

## Functional Requirements

### Identifier strategy

Use a composite key:

- **Authenticated routes:** `user:${userId}` primary; fall back to IP for pre-auth flows.
- **Unauthenticated auth actions:** `ip:${ip}` from `x-forwarded-for` or `x-real-ip` (first hop only).
- **Webhook routes:** do not rate limit Stripe webhooks (signature auth instead).

Document IP extraction for Vercel: `request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()`.

### Limit tiers (starting defaults — tune in implementation)

| Surface | Key | Limit | Window |
|---------|-----|-------|--------|
| Login | IP | 10 attempts | 15 min |
| Signup | IP | 5 accounts | 1 hour |
| Password reset request | IP + email hash | 3 | 1 hour |
| Email verification resend | user or IP | 5 | 1 hour |
| Checkout session create | user | 10 | 1 hour |
| Image upload token | user or IP | 30 | 1 hour |

Sliding window or fixed window — either is acceptable if documented.

### Integration points

Create `src/lib/rate-limit.ts`:

```ts
export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  window: string,
): Promise<{ success: boolean; retryAfter?: number }>;
```

Call from:

- `login`, `signup`, `requestPasswordReset`, resend verification in `src/lib/auth/actions.ts` at the start of each action.
- `createCheckoutSession` in `src/app/actions/stripe.ts`.
- `onBeforeGenerateToken` in cottage image upload route (after auth).

On failure, return user-facing Slovak error or throw mapped to `429` for API routes.

### Development bypass

When `NODE_ENV === 'development'`, optionally skip limits or use very high thresholds via env `RATE_LIMIT_DISABLED=true` in `.env.local` only — never in production.

### Environment variables

Document in `.env.example`:

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Or Vercel KV equivalents if the project standardizes on that.

## Suggested Files

- `src/lib/rate-limit.ts`
- `src/lib/rate-limit.test.ts` — mock Redis; assert bucket keys
- `src/lib/auth/actions.ts` — wire limits
- `src/app/actions/stripe.ts` — wire limits
- `src/app/api/cottage-images/upload/route.ts` — wire limits
- `.env.example` — new vars

## Testing

- Unit test: when limit exceeded, action returns error / API returns 429.
- Unit test: development bypass does not block when env set.
- Manual: rapid login failures → 429 after threshold.

## Manual Verification

1. Exceed login limit from one IP → blocked with clear message.
2. Normal login after window expires → works.
3. Checkout still works under normal use.
4. Image upload works for owners under normal use.
5. Stripe webhook still processes events when spamming other endpoints.
6. `bun test`, `bun lint-format`, `bun build` pass.

## Acceptance Criteria

- Auth, checkout, and upload surfaces enforce documented rate limits in production.
- Legitimate single-user flows are not blocked under normal usage.
- Limit configuration lives in one module.
- `.env.example` documents required Redis/KV credentials.
- `bun lint-format` and `bun build` pass.

## Implementation Notes

- Server actions do not automatically expose HTTP status codes; map `429` semantics to `ActionResponse` error codes the client can display.
- If Upstash is not provisioned before launch, blocking launch on Redis is correct — in-memory limits are **not** acceptable on multi-instance Vercel.
- Coordinate with image upload auth spec: limit anonymous attempts even after auth ships (defense in depth).

## Open Decisions

- Upstash Redis vs Vercel KV (pick one; Upstash is common for `@upstash/ratelimit`).
- Whether to add middleware-level IP limiting for all `/api/*` routes (optional stretch).
