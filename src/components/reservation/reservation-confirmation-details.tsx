import clsx from 'clsx';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import {
  formatReservationSummaryDate,
  getReservationPriceBreakdown,
  type ReservationConfirmationSummary,
} from '@/lib/reservation/summary';

type ReservationConfirmationDetailsProps = {
  summary: ReservationConfirmationSummary;
  variant?: 'post_payment' | 'dashboard';
};

const euroFormatter = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
});

function formatEuro(amount: number) {
  return euroFormatter.format(amount);
}

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
            <StatusBadge
              label={t(`Status.${summary.status}`)}
              status={summary.status}
            />
          </div>
        </div>

        <div className="grid gap-4">
          <InfoCard title={t('Stay.Title')}>
            <SummaryRow
              label={t('Stay.Dates')}
              value={`${fromDate} - ${toDate}`}
            />
            <SummaryRow
              label={t('Stay.Nights')}
              value={t('Stay.NightsValue', { nights: summary.nights })}
            />
            <SummaryRow
              label={t('Stay.Beds')}
              value={t('Stay.BedsValue', { beds: summary.bedsReserved })}
            />
          </InfoCard>

          <InfoCard title={t('Price.Title')}>
            <SummaryRow
              label={t('Price.AccommodationCalculation')}
              value={`${summary.nights} × ${summary.bedsReserved} × ${formatEuro(
                summary.pricePerNight,
              )}`}
            />
            <SummaryRow
              label={t('Price.AccommodationTotal')}
              value={formatEuro(priceBreakdown.accommodation)}
            />
            <SummaryRow
              label={t('Price.ReservationFee')}
              value={formatEuro(priceBreakdown.reservationFee)}
            />
            <SummaryRow
              isStrong
              label={t('Price.PaidTotal')}
              value={formatEuro(priceBreakdown.grandTotal)}
            />
          </InfoCard>

          <InfoCard title={t('CottageContact.Title')}>
            <SummaryRow
              label={t('CottageContact.Name')}
              value={summary.cottage.name}
            />
            <SummaryRow
              label={t('CottageContact.Address')}
              value={summary.cottage.address}
            />
            <SummaryRow
              label={t('CottageContact.Email')}
              value={
                <ContactLink
                  href={summary.cottage.email}
                  notProvided={notProvided}
                  type="email"
                />
              }
            />
            <SummaryRow
              label={t('CottageContact.Phone')}
              value={
                <ContactLink
                  href={summary.cottage.phoneNumber}
                  notProvided={notProvided}
                  type="phone"
                />
              }
            />
            <SummaryRow
              label={t('CottageContact.Website')}
              value={
                <ContactLink
                  href={summary.cottage.website}
                  notProvided={notProvided}
                  type="website"
                />
              }
            />
          </InfoCard>

          <InfoCard title={t('GuestContact.Title')}>
            <SummaryRow
              label={t('GuestContact.Name')}
              value={summary.guest.name ?? notProvided}
            />
            <SummaryRow
              label={t('GuestContact.Email')}
              value={summary.guest.email ?? notProvided}
            />
            <SummaryRow
              label={t('GuestContact.Phone')}
              value={summary.guest.phoneNumber ?? notProvided}
            />
          </InfoCard>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
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

function StatusBadge({
  label,
  status,
}: {
  label: string;
  status: ReservationConfirmationSummary['status'];
}) {
  const statusClasses = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-600',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-600',
  };

  return (
    <Badge
      variant="outline"
      className="flex w-fit items-center gap-2 font-normal text-black"
    >
      <span className={clsx('size-2 rounded-full', statusClasses[status])} />
      {label}
    </Badge>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <dl className="space-y-3">{children}</dl>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  isStrong = false,
}: {
  label: string;
  value: ReactNode;
  isStrong?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className={clsx('text-black', isStrong && 'font-semibold')}>
        {value}
      </dd>
    </div>
  );
}

function ContactLink({
  href,
  notProvided,
  type,
}: {
  href: string | null;
  notProvided: string;
  type: 'email' | 'phone' | 'website';
}) {
  if (!href) {
    return notProvided;
  }

  const linkHref =
    type === 'email'
      ? `mailto:${href}`
      : type === 'phone'
        ? `tel:${href}`
        : href;

  return (
    <a className="underline underline-offset-4" href={linkHref}>
      {href}
    </a>
  );
}
