import { NavHeader } from '@/components/navHeader';
import { Toaster } from '@/components/ui/sonner';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Work_Sans, Alatsi } from 'next/font/google';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          'flex size-full min-h-screen flex-col items-center antialiased',
          workSans.className,
          alatsi.variable,
        )}
      >
        <NavHeader />
        <main className="flex size-full max-w-[1600px] flex-col items-center">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
