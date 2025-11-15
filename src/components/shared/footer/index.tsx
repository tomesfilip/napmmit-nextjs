'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="mt-auto w-full bg-grey px-4 py-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1600px] space-y-16">
        <div className="space-y-8 text-center lg:text-left">
          <Link href="/" className="w-max font-alatsi text-2xl uppercase">
            Napmmit
          </Link>
          <div className="space-y-6">
            <Link className="hover:underline" href="mailto:help@napmmit.sk">
              help@napmmit.sk
            </Link>
            {/* <Socials /> */}
          </div>
        </div>
        <div className="w-full space-y-10 text-center lg:text-left">
          <ul className="flex flex-col gap-5 text-sm lg:flex-row">
            <li>
              <Link className="hover:underline" href="/privacy-policy">
                {t('Legal.PrivacyPolicy')}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/cookie-policy">
                {t('Legal.CookiePolicy')}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/terms-of-use">
                {t('Legal.TermsOfUse')}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => window.openCookieSettings()}
                className="hover:underline"
              >
                {t('Legal.CookieSettings')}
              </button>
            </li>
          </ul>
          <p className="text-sm">
            ©{new Date().getFullYear() + ' ' + t('AllRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};
