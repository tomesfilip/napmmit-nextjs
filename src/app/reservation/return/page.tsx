import Link from 'next/link';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { sendReservationConfirmationEmailOnce } from '@/lib/reservation/confirmation';
import { getReservationPaymentStatus } from '@/lib/reservation/payment-status';
import { fulfillPaidCheckoutSession } from '@/lib/stripe/fulfill-checkout-session';
import { ReservationReturnRedirect } from './reservation-return-redirect';
import { ReservationReturnStatus } from './reservation-return-status';

type ReservationReturnPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ReservationReturnPage({
  searchParams,
}: ReservationReturnPageProps) {
  const { session_id: checkoutSessionId } = await searchParams;
  let paymentStatus = await getReservationPaymentStatus(checkoutSessionId);

  if (paymentStatus.status === 'not_found' && checkoutSessionId) {
    await fulfillPaidCheckoutSession(checkoutSessionId);
    paymentStatus = await getReservationPaymentStatus(checkoutSessionId);
  }

  if (paymentStatus.status === 'reservation_created') {
    if (!paymentStatus.accessToken) {
      notFound();
    }

    after(() =>
      sendReservationConfirmationEmailOnce(paymentStatus.reservationId),
    );

    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="rounded-lg border bg-white p-8 shadow-xs">
          <ReservationReturnRedirect accessToken={paymentStatus.accessToken} />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-lg border bg-white p-8 shadow-xs">
        {paymentStatus.status === 'not_found' && checkoutSessionId && (
          <ReservationReturnStatus checkoutSessionId={checkoutSessionId} />
        )}

        {paymentStatus.status === 'missing_session' && (
          <>
            <p className="mb-2 text-sm font-medium text-red-700">
              Platba sa nenašla
            </p>
            <h1 className="mb-3 text-2xl font-semibold">
              Chýba identifikátor platby
            </h1>
            <p className="text-sm text-gray-600">
              Nepodarilo sa overiť stav platby. Vráťte sa na stránku chaty a
              skúste rezerváciu znova.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Späť na úvod
        </Link>
      </div>
    </main>
  );
}
