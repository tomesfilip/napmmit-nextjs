'use client';

import { ROUTES } from '@/lib/constants';
import { getCottage } from '@/server/db/queries';
import { useCreateFormStore } from '@/stores/createFormStore';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

const EditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const router = useRouter();
  const setData = useCreateFormStore((state) => state.setData);
  const setMode = useCreateFormStore((state) => state.setMode);

  useEffect(() => {
    const loadCottageData = async () => {
      const cottageId = Number(id);
      if (isNaN(cottageId)) {
        router.push('/dashboard');
        return;
      }

      const { success: cottage, error } = await getCottage(cottageId);
      if (!cottage) {
        if (error) console.error('EditPage Error: ', error);
        router.push('/dashboard');
        return;
      }

      setData({
        cottageId,
        title: cottage.name,
        description: cottage.description || '',
        services: cottage.cottageServices?.map((s) => s.id) || [],
        images:
          cottage.images.map(({ id, src, width, height, order }) => {
            return {
              id,
              src,
              width,
              height,
              order,
            };
          }) || [],
        pricePerNight: cottage.pricePerNight,
        occupancy: cottage.capacity,
        email: cottage.email || '',
        phone: cottage.phoneNumber || '',
        address: cottage.address,
        locationUrl: cottage.locationURL || '',
        mountainArea: cottage.mountainArea,
      });

      setMode('edit', cottageId);

      router.push(`/edit/${id}/${ROUTES.CREATE_COTTAGE.STEP_ONE}`);
    };

    loadCottageData();
  }, [id, setData, router]);

  return <div>Loading...</div>;
};

export default EditPage;
