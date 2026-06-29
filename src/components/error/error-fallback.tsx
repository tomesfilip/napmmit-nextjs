'use client';

import { HomeIcon, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EMAIL_SUPPORT } from '@/lib/constants';

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  const t = useTranslations('Error');
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.error(
      'Route error:',
      error.digest ?? 'no-digest',
      error.message,
      error,
    );
  }, [error]);

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t('Title')}</CardTitle>
          <CardDescription>{t('Description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {!isDev && error.digest ? (
            <p className="text-sm text-muted-foreground">
              {t('Digest', { digest: error.digest })}
            </p>
          ) : null}
          {isDev ? (
            <details className="rounded-md border bg-muted/50 p-3 text-left text-sm">
              <summary className="cursor-pointer font-medium">
                {t('Details')}
              </summary>
              <p className="mt-2 break-words font-mono text-xs">
                {error.message}
              </p>
              {error.digest ? (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {t('Digest', { digest: error.digest })}
                </p>
              ) : null}
            </details>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={reset}>
            <RefreshCw className="mr-2 size-4" />
            {t('Retry')}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <HomeIcon className="mr-2 size-4" />
              {t('GoHome')}
            </Link>
          </Button>
        </CardFooter>
        <div className="pb-6 text-center">
          <a
            href={`mailto:${EMAIL_SUPPORT}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {t('Support')}
          </a>
        </div>
      </Card>
    </div>
  );
}
