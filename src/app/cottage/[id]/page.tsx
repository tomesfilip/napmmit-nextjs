import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ContactSection } from '@/components/cottageDetail/contact-section';
import { DetailGallery } from '@/components/cottageDetail/detail-gallery';
import { LocationSection } from '@/components/cottageDetail/location-section';
import { MobileGallery } from '@/components/cottageDetail/mobile-gallery';
import { ReservationSection } from '@/components/cottageDetail/reservation-section';
import { DetailSection } from '@/components/ui/detail-section';
import { validateRequest } from '@/lib/auth/validateRequest';
import { getAvailableBeds } from '@/lib/availability';
import {
  getDefaultReservationDateRange,
  isValidReservationRange,
  parseReservationDateParam,
} from '@/lib/reservation-date-range';
import { getCottage } from '@/server/db/queries';

const CottageDetail = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) => {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const sp = await searchParams;
  const defaults = getDefaultReservationDateRange();

  const fromParam = sp.from?.trim() ?? '';
  const toParam = sp.to?.trim() ?? '';

  if (!fromParam || !toParam) {
    redirect(
      `/cottage/${idParam}?from=${defaults.fromParam}&to=${defaults.toParam}`,
    );
  }

  const fromDate = parseReservationDateParam(fromParam);
  const toDate = parseReservationDateParam(toParam);

  if (!fromDate || !toDate || !isValidReservationRange(fromDate, toDate)) {
    redirect(
      `/cottage/${idParam}?from=${defaults.fromParam}&to=${defaults.toParam}`,
    );
  }

  const [{ success: cottage, error }, { user }] = await Promise.all([
    getCottage(id),
    validateRequest(),
  ]);

  const initialAvailability =
    cottage != null ? await getAvailableBeds(id, fromDate, toDate) : [];

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
            {cottage.images && cottage.images.length > 0 && (
              <DetailGallery images={cottage.images} />
            )}
          </DetailSection>
          <div className="grid w-full grid-flow-row justify-center gap-8 px-4 lg:px-12 xl:grid-cols-12">
            <Suspense
              fallback={
                <div className="min-h-[320px] rounded-lg border bg-white p-6 shadow-xs xl:col-span-5 2xl:col-span-4" />
              }
            >
              <ReservationSection
                {...cottage}
                reservedRanges={[]}
                user={user}
                initialAvailability={initialAvailability}
                urlRangeFrom={fromParam}
                urlRangeTo={toParam}
              />
            </Suspense>
            <ContactSection {...cottage} />
          </div>
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
