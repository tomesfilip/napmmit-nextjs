'use client';

import { ErrorFallback } from '@/components/error/error-fallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteError({ error, reset }: ErrorProps) {
  return <ErrorFallback error={error} reset={reset} />;
}
