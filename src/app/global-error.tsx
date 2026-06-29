'use client';

import { useEffect } from 'react';
import { EMAIL_SUPPORT } from '@/lib/constants';
import './globals.css';

const COPY = {
  title: 'Niečo sa pokazilo',
  description:
    'Pri načítaní stránky sa vyskytla chyba. Skúste to znova alebo sa vráťte na úvodnú stránku.',
  retry: 'Skúsiť znova',
  goHome: 'Úvodná stránka',
  support: 'Kontaktovať podporu',
  digest: (id: string) => `Kód chyby: ${id}`,
  details: 'Technické detaily',
} as const;

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.error(
      'Global error:',
      error.digest ?? 'no-digest',
      error.message,
      error,
    );
  }, [error]);

  return (
    <html lang="sk">
      <body className="flex min-h-screen items-center justify-center bg-white p-4 font-sans text-gray-900 antialiased">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">{COPY.title}</h1>
            <p className="text-sm text-gray-600">{COPY.description}</p>
          </div>

          <div className="mt-4 space-y-4 text-center">
            {!isDev && error.digest ? (
              <p className="text-sm text-gray-500">
                {COPY.digest(error.digest)}
              </p>
            ) : null}
            {isDev ? (
              <details className="rounded-md border border-gray-200 bg-gray-50 p-3 text-left text-sm">
                <summary className="cursor-pointer font-medium">
                  {COPY.details}
                </summary>
                <p className="mt-2 break-words font-mono text-xs">
                  {error.message}
                </p>
                {error.digest ? (
                  <p className="mt-1 font-mono text-xs text-gray-500">
                    {COPY.digest(error.digest)}
                  </p>
                ) : null}
              </details>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800"
            >
              {COPY.retry}
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium hover:bg-gray-50"
            >
              {COPY.goHome}
            </a>
          </div>

          <p className="mt-4 text-center">
            <a
              href={`mailto:${EMAIL_SUPPORT}`}
              className="text-sm text-gray-500 underline-offset-4 hover:underline"
            >
              {COPY.support}
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
