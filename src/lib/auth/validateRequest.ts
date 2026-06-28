import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { cache } from 'react';
import { lucia } from '@/lib/auth';

type RequestValidationResult = Awaited<
  ReturnType<typeof lucia.validateSession>
>;

export type SessionCookieUpdate = ReturnType<typeof lucia.createSessionCookie>;

export type RequestValidationFromRequest = {
  result: RequestValidationResult;
  sessionCookie?: SessionCookieUpdate;
};

function resolveSessionCookieUpdate(
  result: RequestValidationResult,
): SessionCookieUpdate | undefined {
  if (result.session?.fresh) {
    return lucia.createSessionCookie(result.session.id);
  }

  if (!result.session) {
    return lucia.createBlankSessionCookie();
  }

  return undefined;
}

export async function validateRequestFromRequest(
  request: Request,
): Promise<RequestValidationFromRequest> {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const sessionId = lucia.readSessionCookie(cookieHeader);
  if (!sessionId) {
    return { result: { user: null, session: null } };
  }

  const result = await lucia.validateSession(sessionId);
  return {
    result,
    sessionCookie: resolveSessionCookieUpdate(result),
  };
}

function setSessionCookieOnStore(
  cookiesStore: Awaited<ReturnType<typeof cookies>>,
  sessionCookie?: SessionCookieUpdate,
): void {
  if (!sessionCookie) {
    return;
  }

  try {
    cookiesStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch {
    console.error('Failed to set session cookie');
  }
}

export function applySessionCookieToResponse(
  response: NextResponse,
  sessionCookie?: SessionCookieUpdate,
): NextResponse {
  if (!sessionCookie) {
    return response;
  }

  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return response;
}

export const uncachedValidateRequest =
  async (): Promise<RequestValidationResult> => {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { user: null, session: null };
    }
    const result = await lucia.validateSession(sessionId);
    setSessionCookieOnStore(cookiesStore, resolveSessionCookieUpdate(result));
    return result;
  };

export const validateRequest = cache(uncachedValidateRequest);
