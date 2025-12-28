import { DetailSection } from '@/components/ui/detail-section';
import { getCottage } from '@/server/db/queries';

import { ContactSection } from '@/components/cottageDetail/contact-section';
import { DetailGallery } from '@/components/cottageDetail/detail-gallery';
import { LocationSection } from '@/components/cottageDetail/location-section';
import { MobileGallery } from '@/components/cottageDetail/mobile-gallery';
import { use } from 'react';

const CottageDetail = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;
  console.log('Fetching cottage with id:', id);
  const { success: cottage, error } = await getCottage(id);

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <>
      {error && <div>{error}</div>}
      {cottage && (
        <div className="flex w-full flex-col items-center gap-10 lg:gap-16 lg:py-20">
          <MobileGallery images={cottage.images} />
          <DetailSection>
            <div className="max-w-[600px] space-y-6">
              <h1 className="text-4xl font-semibold lg:text-6xl">
                {cottage.name}
              </h1>
              <p className="xl:text-lg">{cottage.description}</p>
            </div>
            {cottage.images && cottage.images.length > 1 && (
              <DetailGallery images={cottage.images} />
            )}
          </DetailSection>
          <ContactSection {...cottage} />
          <LocationSection
            address={cottage.address}
            locationURL={cottage.locationURL}
          />
        </div>
      )}
    </>
  );
};

export default CottageDetail;
