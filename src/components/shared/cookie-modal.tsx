'use client';

import { COOKIE_KEY } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const CookieConsent = () => {
  const t = useTranslations('CookieModal');
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      setOpen(true);
    } else {
      try {
        setConsent(JSON.parse(saved));
      } catch {
        setOpen(true);
      }
    }
  }, []);

  const saveConsent = (newConsent: typeof consent) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(newConsent));
    document.cookie = `${COOKIE_KEY}=${JSON.stringify(newConsent)}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setConsent(newConsent);
    setOpen(false);
    setSettingsOpen(false);
  };

  const acceptAll = () =>
    saveConsent({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () =>
    saveConsent({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    window.openCookieSettings = () => setSettingsOpen(true);
  }, []);

  if (!open && !settingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="m-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        {!settingsOpen ? (
          <>
            <h2 className="mb-2 text-xl font-semibold">{t('Title')}</h2>
            <p className="mb-4 text-sm text-gray-600">
              {t('Description')}{' '}
              <Link
                href="/cookie-policy"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {t('PolicyLink')}
              </Link>
              .
            </p>
            <div className="flex flex-col justify-end gap-3 sm:flex-row">
              <button
                onClick={rejectAll}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                {t('Reject')}
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                {t('Settings')}
              </button>
              <button
                onClick={acceptAll}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                {t('AcceptAll')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-3 text-lg font-semibold">{t('SettingsTitle')}</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-lg border p-3">
                <span>{t('Necessary')}</span>
                <input type="checkbox" checked disabled />
              </label>

              <label className="flex items-center justify-between rounded-lg border p-3">
                <span>{t('Analytics')}</span>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent({ ...consent, analytics: e.target.checked })
                  }
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border p-3">
                <span>{t('Marketing')}</span>
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent({ ...consent, marketing: e.target.checked })
                  }
                />
              </label>
            </div>

            <div className="mt-4 flex flex-col justify-end gap-3 sm:flex-row">
              <button
                onClick={() => setSettingsOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                {t('Back')}
              </button>
              <button
                onClick={() => saveConsent(consent)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                {t('SaveSettings')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    openCookieSettings: () => void;
  }
}
