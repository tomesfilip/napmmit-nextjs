'use client';

import { getCottage } from '@/server/db/queries';
import { useCreateFormStore } from '@/stores/createFormStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const EditPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const setData = useCreateFormStore((state) => state.setData);

  useEffect(() => {
    const loadCottageData = async () => {
      const cottageId = Number(params.id);
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
        services: cottage.cottageServices?.map((s) => s.name) || [],
        images: cottage.images?.map((img) => img.src) || [],
        pricePerNight: cottage.pricePerNight,
        occupancy: cottage.capacity,
        email: cottage.email || '',
        phone: cottage.phoneNumber || '',
        address: cottage.address,
        locationUrl: cottage.locationURL || '',
        mountainArea: cottage.mountainArea,
      });

      router.push(`/edit/${params.id}/step-one`);
    };

    loadCottageData();
  }, [params.id, setData, router]);

  return <div>Loading...</div>;
};

export default EditPage;
