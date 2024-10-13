import { DetailSection } from '@/components/ui/detail-section';
import { getCottage } from '@/server/db/queries';
import Link from 'next/link';
import { FaLink, FaLocationDot, FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

import DetailGallery from '@/components/cottageDetail/DetailGallery';

const CottageDetail = async ({ params }: { params: { id: number } }) => {
  const { success: cottage, error } = await getCottage(params.id);

  return (
    <>
      {error && <div>{error}</div>}
      {cottage && (
        <div className="flex w-full flex-col items-center gap-16 py-20">
          <DetailSection>
            <div className="max-w-[600px] space-y-6">
              <h1 className="text-4xl font-semibold lg:text-6xl">
                {cottage.name}
              </h1>
              <p className="lg:text-lg">{cottage.description}</p>
            </div>
            {cottage.images && cottage.images.length > 1 && (
              <DetailGallery images={cottage.images} />
            )}
          </DetailSection>
          <DetailSection>
            <div className="space-y-4">
              <div className="flex max-w-[600px] flex-wrap items-center gap-2">
                {/* replace by corresponding */}
                <FaLocationDot className="size-8" />
                <p className="lg:text-lg">{cottage.address}</p>
              </div>
            </div>
            {cottage.locationURL && (
              <iframe
                style={{ border: 'none' }}
                src={cottage.locationURL}
                width="740"
                height="360"
              />
            )}
          </DetailSection>
          <div className="flex w-full flex-wrap gap-6 lg:gap-12">
            {cottage.phoneNumber && (
              <div className="flex items-center gap-2">
                <FaPhone className="size-7 flex-shrink-0" />
                <a href={`tel:${cottage.phoneNumber}`}>{cottage.phoneNumber}</a>
              </div>
            )}
            {cottage.email && (
              <div className="flex items-center gap-2">
                <MdEmail className="size-7 flex-shrink-0" />
                <a href={`mailto:${cottage.email}`}>{cottage.email}</a>
              </div>
            )}
            {cottage.website && (
              <div className="flex items-center gap-2">
                <FaLink className="size-7 flex-shrink-0" />
                <Link
                  className="max-w-[230px] overflow-hidden overflow-ellipsis lg:max-w-[360px]"
                  target="_blank"
                  href={cottage.website}
                >
                  {cottage.website}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CottageDetail;
