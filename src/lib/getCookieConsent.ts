import { cookies } from 'next/headers';
import { CookieConsentType } from './appTypes';
import { COOKIE_KEY } from './constants';

export function getCookieConsent(): CookieConsentType {
  const cookieStore = cookies();
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
