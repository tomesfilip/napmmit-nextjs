'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedSpinner } from '@/components/icons';
import { ROUTES } from '@/lib/constants';
import { getReservationReturnStatus } from './actions';

type ReservationReturnStatusProps = {
  checkoutSessionId: string;
};

const MAX_STATUS_CHECKS = 10;
const STATUS_CHECK_INTERVAL_MS = 1500;
const LOADING_MESSAGE_INTERVAL_MS = 2500;

const LOADING_MESSAGES = [
  'Overujeme platbu zo Stripe…',
  'Potvrdzujeme detaily rezervácie…',
  'Pripravujeme vaše potvrdenie…',
  'Už skoro hotovo…',
] as const;

export function ReservationReturnStatus({
  checkoutSessionId,
}: ReservationReturnStatusProps) {
  const router = useRouter();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (hasTimedOut) return;

    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex(
        (current) => (current + 1) % LOADING_MESSAGES.length,
      );
    }, LOADING_MESSAGE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasTimedOut]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timeoutId: number | undefined;

    const checkStatus = async () => {
      attempts += 1;
      const status = await getReservationReturnStatus(checkoutSessionId);

      if (cancelled) return;

      if (status.status === 'reservation_created' && status.accessToken) {
        router.replace(ROUTES.RESERVATION.CONFIRMATION(status.accessToken));
        return;
      }

      if (attempts >= MAX_STATUS_CHECKS) {
        setHasTimedOut(true);
        return;
      }

      timeoutId = window.setTimeout(checkStatus, STATUS_CHECK_INTERVAL_MS);
    };

    timeoutId = window.setTimeout(checkStatus, STATUS_CHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [checkoutSessionId, router]);

  return (
    <>
      <p className="mb-2 text-sm font-medium text-yellow-700">
        Rezerváciu pripravujeme
      </p>
      <h1 className="mb-6 text-2xl font-semibold">Rezervácia sa spracováva</h1>

      {!hasTimedOut && (
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-yellow-400/20" />
            <AnimatedSpinner className="relative size-8 animate-spin text-yellow-600" />
          </div>
          <p
            aria-live="polite"
            className="min-h-5 animate-in fade-in text-sm text-gray-600 duration-500"
            key={loadingMessageIndex}
          >
            {LOADING_MESSAGES[loadingMessageIndex]}
          </p>
        </div>
      )}

      <p className="text-sm text-gray-600">
        Keď bude rezervácia pripravená, zobrazíme vám potvrdenie rezervácie.
      </p>
      {hasTimedOut && (
        <p className="mt-4 text-sm text-gray-600">
          Spracovanie trvá dlhšie než zvyčajne. Skontrolujte rezervácie o chvíľu
          alebo sa vráťte na úvod.
        </p>
      )}
    </>
  );
}
