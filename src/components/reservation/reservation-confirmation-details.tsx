import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { formatEuro } from '@/lib/reservation/format-euro';
import { getPdfDownloadHref } from '@/lib/reservation/get-pdf-download-href';
import { isReservationStatusType } from '@/lib/reservation/status';
import {
  formatReservationSummaryDate,
  getReservationPriceBreakdown,
  type ReservationConfirmationSummary,
} from '@/lib/reservation/summary';
import { ConfirmationContactLink } from './confirmation-contact-link';
import { ConfirmationInfoCard } from './confirmation-info-card';
import { ConfirmationStatusBadge } from './confirmation-status-badge';
import { ConfirmationSummaryRow } from './confirmation-summary-row';

type ReservationConfirmationDetailsProps = {
  summary: ReservationConfirmationSummary;
  variant?: 'post_payment' | 'dashboard';
};

export async function ReservationConfirmationDetails({
  summary,
  variant = 'post_payment',
}: ReservationConfirmationDetailsProps) {
  const t = await getTranslations('ReservationConfirmationPage');
  const priceBreakdown = getReservationPriceBreakdown(summary);
  const fromDate = formatReservationSummaryDate(summary.from);
  const toDate = formatReservationSummaryDate(summary.to);
  const notProvided = t('NotProvided');
  const isDashboard = variant === 'dashboard';
  const pdfDownloadHref = getPdfDownloadHref(summary, variant);
  const statusLabel = isReservationStatusType(summary.status)
    ? t(`Status.${summary.status}`)
    : t('Status.unknown');

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="rounded-lg border bg-white p-6 shadow-xs">
        <div className="mb-8">
          {!isDashboard && (
            <p className="mb-2 text-sm font-medium text-green-700">
              {t('PaymentConfirmed')}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">
                {isDashboard ? summary.cottage.name : t('Title')}
              </h1>
              <p className="mt-3 text-sm text-gray-600">
                {isDashboard ? t('DetailSubtitle') : t('Subtitle')}
              </p>
            </div>
            <ConfirmationStatusBadge label={statusLabel} status={summary.status} />
          </div>
        </div>

        <div className="grid gap-4">
          <ConfirmationInfoCard title={t('Stay.Title')}>
            <ConfirmationSummaryRow
              label={t('Stay.Dates')}
              value={`${fromDate} - ${toDate}`}
            />
            <ConfirmationSummaryRow
              label={t('Stay.Nights')}
              value={t('Stay.NightsValue', { nights: summary.nights })}
            />
            <ConfirmationSummaryRow
              label={t('Stay.Beds')}
              value={t('Stay.BedsValue', { beds: summary.bedsReserved })}
            />
          </ConfirmationInfoCard>

          <ConfirmationInfoCard title={t('Price.Title')}>
            <ConfirmationSummaryRow
              label={t('Price.AccommodationCalculation')}
              value={`${summary.nights} × ${summary.bedsReserved} × ${formatEuro(
                summary.pricePerNight,
              )}`}
            />
            <ConfirmationSummaryRow
              label={t('Price.AccommodationTotal')}
              value={formatEuro(priceBreakdown.accommodation)}
            />
            <ConfirmationSummaryRow
              label={t('Price.ReservationFee')}
              value={formatEuro(priceBreakdown.reservationFee)}
            />
            <ConfirmationSummaryRow
              isStrong
              label={t('Price.PaidTotal')}
              value={formatEuro(priceBreakdown.grandTotal)}
            />
          </ConfirmationInfoCard>

          <ConfirmationInfoCard title={t('CottageContact.Title')}>
            <ConfirmationSummaryRow
              label={t('CottageContact.Name')}
              value={summary.cottage.name}
            />
            <ConfirmationSummaryRow
              label={t('CottageContact.Address')}
              value={summary.cottage.address}
            />
            <ConfirmationSummaryRow
              label={t('CottageContact.Email')}
              value={
                <ConfirmationContactLink
                  href={summary.cottage.email}
                  notProvided={notProvided}
                  type="email"
                />
              }
            />
            <ConfirmationSummaryRow
              label={t('CottageContact.Phone')}
              value={
                <ConfirmationContactLink
                  href={summary.cottage.phoneNumber}
                  notProvided={notProvided}
                  type="phone"
                />
              }
            />
            <ConfirmationSummaryRow
              label={t('CottageContact.Website')}
              value={
                <ConfirmationContactLink
                  href={summary.cottage.website}
                  notProvided={notProvided}
                  type="website"
                />
              }
            />
          </ConfirmationInfoCard>

          <ConfirmationInfoCard title={t('GuestContact.Title')}>
            <ConfirmationSummaryRow
              label={t('GuestContact.Name')}
              value={summary.guest.name ?? notProvided}
            />
            <ConfirmationSummaryRow
              label={t('GuestContact.Email')}
              value={summary.guest.email ?? notProvided}
            />
            <ConfirmationSummaryRow
              label={t('GuestContact.Phone')}
              value={summary.guest.phoneNumber ?? notProvided}
            />
          </ConfirmationInfoCard>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            {isDashboard ? (
              <Button asChild>
                <Link href={ROUTES.DASHBOARD.RESERVATIONS}>
                  {t('BackToReservations')}
                </Link>
              </Button>
            ) : summary.guest.isLoggedIn ? (
              <Button asChild>
                <Link href={ROUTES.DASHBOARD.RESERVATIONS}>
                  {t('DashboardCta')}
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-gray-600">{t('AnonymousFollowUp')}</p>
            )}
            {pdfDownloadHref ? (
              <Button asChild variant="outline">
                <a href={pdfDownloadHref}>{t('PdfDownload')}</a>
              </Button>
            ) : null}
          </div>
          {!isDashboard && (
            <Button asChild variant="outline">
              <Link href="/">{t('BackHome')}</Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
