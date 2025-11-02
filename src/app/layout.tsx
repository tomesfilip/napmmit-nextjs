import { NavHeader } from '@/components/nav-header';
import { CookieConsent } from '@/components/shared/cookie-modal';
import { Footer } from '@/components/shared/footer';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getCookieConsent } from '@/lib/getCookieConsent';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Alatsi, Work_Sans } from 'next/font/google';
import './globals.css';

const workSans = Work_Sans({ subsets: ['latin'] });
const alatsi = Alatsi({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-alatsi',
});

export const metadata: Metadata = {
  title: 'Napmmit | Mountain cottage list in Slovakia',
  description:
    'Web platform designed to simplify the process of discovering and reserving mountain cottages.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const consent = getCookieConsent();

  console.log('Consent: ', consent);

  return (
    <html lang={locale}>
      <NextIntlClientProvider>
        <body
          className={clsx(
            'flex size-full min-h-screen flex-col items-center antialiased',
            workSans.className,
            alatsi.variable,
          )}
        >
          <NavHeader />
          <main className="flex size-full max-w-[1600px] flex-col items-center">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
          <Footer />
          <Toaster />
          <CookieConsent />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
