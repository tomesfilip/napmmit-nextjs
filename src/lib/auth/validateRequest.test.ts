import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applySessionCookieToResponse } from './validateRequest';

const luciaMocks = vi.hoisted(() => ({
  sessionCookieName: 'session',
  readSessionCookie: vi.fn(),
  validateSession: vi.fn(),
  createSessionCookie: vi.fn(),
  createBlankSessionCookie: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  lucia: luciaMocks,
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

const { validateRequestFromRequest } = await import('./validateRequest');

describe('validateRequestFromRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    luciaMocks.createSessionCookie.mockReturnValue({
      name: 'session',
      value: 'refreshed',
      attributes: { path: '/' },
    });
    luciaMocks.createBlankSessionCookie.mockReturnValue({
      name: 'session',
      value: '',
      attributes: { path: '/' },
    });
  });

  it('returns no cookie update when the request has no session cookie', async () => {
    luciaMocks.readSessionCookie.mockReturnValue(null);

    await expect(
      validateRequestFromRequest(new Request('https://example.com')),
    ).resolves.toEqual({
      result: { user: null, session: null },
    });
  });

  it('returns a refreshed session cookie when the session is fresh', async () => {
    luciaMocks.readSessionCookie.mockReturnValue('session_1');
    luciaMocks.validateSession.mockResolvedValue({
      user: { id: 'user_1' },
      session: { id: 'session_1', fresh: true, expiresAt: new Date() },
    });

    await expect(
      validateRequestFromRequest(
        new Request('https://example.com', {
          headers: { Cookie: 'session=session_1' },
        }),
      ),
    ).resolves.toEqual({
      result: {
        user: { id: 'user_1' },
        session: { id: 'session_1', fresh: true, expiresAt: expect.any(Date) },
      },
      sessionCookie: {
        name: 'session',
        value: 'refreshed',
        attributes: { path: '/' },
      },
    });

    expect(luciaMocks.createSessionCookie).toHaveBeenCalledWith('session_1');
  });

  it('returns a blank session cookie when the session is invalid', async () => {
    luciaMocks.readSessionCookie.mockReturnValue('expired');
    luciaMocks.validateSession.mockResolvedValue({
      user: null,
      session: null,
    });

    await expect(
      validateRequestFromRequest(
        new Request('https://example.com', {
          headers: { Cookie: 'session=expired' },
        }),
      ),
    ).resolves.toEqual({
      result: { user: null, session: null },
      sessionCookie: {
        name: 'session',
        value: '',
        attributes: { path: '/' },
      },
    });

    expect(luciaMocks.createBlankSessionCookie).toHaveBeenCalled();
  });
});

describe('applySessionCookieToResponse', () => {
  it('sets the session cookie on the response when provided', () => {
    const response = {
      cookies: {
        set: vi.fn(),
      },
    };

    applySessionCookieToResponse(response as never, {
      name: 'session',
      value: 'refreshed',
      attributes: { path: '/' },
    });

    expect(response.cookies.set).toHaveBeenCalledWith(
      'session',
      'refreshed',
      { path: '/' },
    );
  });
});
