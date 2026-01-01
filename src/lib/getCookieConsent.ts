import { cookies } from 'next/headers';
import { CookieConsentType } from './appTypes';
import { COOKIE_KEY } from './constants';

export async function getCookieConsent(): Promise<CookieConsentType> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_KEY);

  if (!raw) {
    return { necessary: true, analytics: false, marketing: false };
  }

  try {
    return JSON.parse(raw.value) as CookieConsentType;
  } catch {
    return { necessary: true, analytics: false, marketing: false };
  }
}
