import { DetailSection } from '@/components/ui/detail-section';
import { getCottage } from '@/server/db/queries';

import { DetailGallery } from '@/components/cottageDetail/detail-gallery';
import { LocationSection } from '@/components/cottageDetail/location-section';
import { ContactSection } from '@/components/cottageDetail/contact-section';
import { MobileGallery } from '@/components/cottageDetail/mobile-gallery';

const CottageDetail = async ({ params }: { params: { id: number } }) => {
  const { success: cottage, error } = await getCottage(params.id);

  return (
    <>
      {error && <div>{error}</div>}
      {cottage && (
        <div className="flex w-full flex-col items-center gap-10 lg:gap-16 lg:py-20">
          <MobileGallery images={cottage.images} />
          <DetailSection className="">
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
