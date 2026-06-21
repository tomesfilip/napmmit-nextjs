import { notFound, redirect } from 'next/navigation';
import { ReservationConfirmationDetails } from '@/components/reservation/reservation-confirmation-details';
import { validateRequest } from '@/lib/auth/validateRequest';
import { getReservationConfirmationSummaryById } from '@/lib/reservation/summary';

type ReservationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationDetailPage({
  params,
}: ReservationDetailPageProps) {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/login');
  }

  const { id: idParam } = await params;
  const reservationId = Number(idParam);

  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    notFound();
  }

  const summary = await getReservationConfirmationSummaryById(
    reservationId,
    user.id,
  );

  if (!summary) {
    notFound();
  }

  return (
    <ReservationConfirmationDetails summary={summary} variant="dashboard" />
  );
}
