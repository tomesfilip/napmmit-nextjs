import { NavHeader } from '@/components/navHeader';
import { Toaster } from '@/components/ui/sonner';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
          'flex flex-col size-full min-h-screen items-center',
          inter.className,
        )}
      >
        <NavHeader />
        <main className="flex flex-col px-4 size-full max-w-[1600px] items-center">
          {children}
        </main>
      </body>
      <Toaster />
    </html>
  );
}
