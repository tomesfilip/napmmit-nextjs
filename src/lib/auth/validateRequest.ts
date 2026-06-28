import { cookies } from 'next/headers';
import { cache } from 'react';
import { lucia } from '@/lib/auth';

type RequestValidationResult = Awaited<
  ReturnType<typeof lucia.validateSession>
>;

export async function validateRequestFromRequest(
  request: Request,
): Promise<RequestValidationResult> {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const sessionId = lucia.readSessionCookie(cookieHeader);
  if (!sessionId) {
    return { user: null, session: null };
  }

  return lucia.validateSession(sessionId);
}

export const uncachedValidateRequest =
  async (): Promise<RequestValidationResult> => {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { user: null, session: null };
    }
    const result = await lucia.validateSession(sessionId);
    try {
      if (result?.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookiesStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookiesStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {
      console.error('Failed to set session cookie');
    }
    return result;
  };

export const validateRequest = cache(uncachedValidateRequest);
