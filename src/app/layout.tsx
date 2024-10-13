import { NavHeader } from '@/components/navHeader';
import { Toaster } from '@/components/ui/sonner';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css';

const workSans = Work_Sans({ subsets: ['latin'] });

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
          'flex size-full min-h-screen flex-col items-center',
          workSans.className,
        )}
      >
        <NavHeader />
        <main className="flex size-full max-w-[1600px] flex-col items-center px-4">
          {children}
        </main>
      </body>
      <Toaster />
    </html>
  );
}
