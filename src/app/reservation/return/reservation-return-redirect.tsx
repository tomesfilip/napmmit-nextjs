'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { AnimatedSpinner } from '@/components/icons';
import { ROUTES } from '@/lib/constants';

type ReservationReturnRedirectProps = {
  accessToken: string;
};

export function ReservationReturnRedirect({
  accessToken,
}: ReservationReturnRedirectProps) {
  const router = useRouter();
  const t = useTranslations('ReservationReturnPage');

  useEffect(() => {
    router.replace(ROUTES.RESERVATION.CONFIRMATION(accessToken));
  }, [accessToken, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedSpinner className="size-8 animate-spin text-yellow-600" />
      <p className="text-sm text-gray-600">{t('Redirecting')}</p>
    </div>
  );
}
