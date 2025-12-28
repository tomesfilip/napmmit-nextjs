import { lucia } from '@/lib/auth';
import type { Session, User } from 'lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
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
