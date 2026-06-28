'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { AnimatedSpinner } from '@/components/icons';
import type { CottageDetailType } from '@/lib/appTypes';
import { ROUTES } from '@/lib/constants';
import { useCreateFormStore } from '@/stores/createFormStore';

type EditCottageLoaderProps = {
  cottage: CottageDetailType;
  cottageId: number;
  editId: string;
};

export function EditCottageLoader({
  cottage,
  cottageId,
  editId,
}: EditCottageLoaderProps) {
  const t = useTranslations('EditCottage.Loader');
  const router = useRouter();
  const setData = useCreateFormStore((state) => state.setData);
  const setMode = useCreateFormStore((state) => state.setMode);

  useEffect(() => {
    setData({
      cottageId,
      title: cottage.name,
      description: cottage.description || '',
      services: cottage.cottageServices?.map((s) => s.id) || [],
      images:
        cottage.images.map(({ id, src, width, height, order }) => ({
          id,
          src,
          width,
          height,
          order,
        })) || [],
      pricePerNight: cottage.pricePerNight,
      totalBeds: cottage.totalBeds,
      email: cottage.email || '',
      phone: cottage.phoneNumber || '',
      address: cottage.address,
      locationUrl: cottage.locationURL || '',
      mountainArea: cottage.mountainArea,
    });

    setMode('edit', cottageId);
    router.push(`/edit/${editId}/${ROUTES.CREATE_COTTAGE.STEP_ONE}`);
  }, [cottage, cottageId, editId, router, setData, setMode]);

  return (
    <div
      aria-busy="true"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
    >
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-yellow-400/20" />
        <AnimatedSpinner className="relative size-8 animate-spin text-yellow-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-yellow-700">{t('Label')}</p>
        <p aria-live="polite" className="mt-1 text-lg font-semibold">
          {t('Title')}
        </p>
        <p className="mt-2 text-sm text-gray-600">{t('Description')}</p>
      </div>
    </div>
  );
}
