import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReservationConfirmationDetails } from '@/components/reservation/reservation-confirmation-details';
import { getReservationConfirmationSummaryByAccessToken } from '@/lib/reservation/summary';

type ReservationConfirmationPageProps = {
  params: Promise<{ accessToken: string }>;
};

export const metadata: Metadata = {
  referrer: 'no-referrer',
};

export default async function ReservationConfirmationPage({
  params,
}: ReservationConfirmationPageProps) {
  const { accessToken } = await params;
  const summary =
    await getReservationConfirmationSummaryByAccessToken(accessToken);

  if (!summary) {
    notFound();
  }

  return <ReservationConfirmationDetails summary={summary} />;
}
