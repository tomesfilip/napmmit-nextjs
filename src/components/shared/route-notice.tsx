'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ROUTE_NOTICE } from '@/lib/auth/route-notices';

export function RouteNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Notices');

  useEffect(() => {
    const notice = searchParams.get('notice');
    if (notice !== ROUTE_NOTICE.OWNER_ONLY) {
      return;
    }

    toast.info(t('OwnerOnly'), {
      duration: 6000,
    });
    router.replace(pathname);
  }, [searchParams, router, pathname, t]);

  return null;
}
