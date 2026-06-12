'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/lib/constants';
import { getReservationReturnStatus } from './actions';

type ReservationReturnStatusProps = {
  checkoutSessionId: string;
};

const MAX_STATUS_CHECKS = 10;
const STATUS_CHECK_INTERVAL_MS = 1500;

export function ReservationReturnStatus({
  checkoutSessionId,
}: ReservationReturnStatusProps) {
  const router = useRouter();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timeoutId: number | undefined;

    const checkStatus = async () => {
      attempts += 1;
      const status = await getReservationReturnStatus(checkoutSessionId);

      if (cancelled) return;

      if (status.status === 'reservation_created') {
        router.replace(ROUTES.DASHBOARD.RESERVATIONS);
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
      <h1 className="mb-3 text-2xl font-semibold">Rezervácia sa spracováva</h1>
      <p className="text-sm text-gray-600">
        Čakáme na potvrdenie platby zo Stripe. Keď bude rezervácia pripravená,
        presmerujeme vás na vaše rezervácie.
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
