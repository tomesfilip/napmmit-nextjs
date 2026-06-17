import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { render } from '@react-email/render';
import { createTranslator } from 'next-intl';
import { APP_TITLE } from '@/lib/constants';
import {
  formatReservationSummaryDate,
  getReservationPriceBreakdown,
  type ReservationConfirmationSummary,
} from '@/lib/reservation/summary';

type Props = {
  summary: ReservationConfirmationSummary;
  dashboardUrl?: string;
  pdfUrl?: string;
  locale?: string;
};

function formatOptionalValue(value: string | null | undefined) {
  return value?.trim() ? value : '—';
}

export default async function ReservationCreatedEmail({
  summary,
  dashboardUrl,
  pdfUrl,
  locale = 'sk',
}: Props) {
  const t = createTranslator({
    messages: await import(`../../../messages/${locale}.json`),
    namespace: 'EmailTemplates.ReservationCreated',
    locale,
  });

  const priceBreakdown = getReservationPriceBreakdown(summary);
  const guestName = summary.guest.name ?? summary.guest.email ?? 'there';
  const statusLabel = t(`Status.${summary.status}`);
  const statusMessage =
    summary.status === 'pending'
      ? t('PendingOwnerMessage')
      : t('StatusMessage', { status: statusLabel });

  return (
    <Html>
      <Head />
      <Preview>{t('Preview', { cottageName: summary.cottage.name })}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>{t('IntroMessage', { guestName })}</Text>
            <Text style={text}>
              {t('MainMessage', { cottageName: summary.cottage.name })}
            </Text>
            <Text style={text}>{t('PaymentConfirmedMessage')}</Text>
            <Text style={text}>{statusMessage}</Text>

            <Text style={sectionTitle}>{t('StaySectionTitle')}</Text>
            <Text style={text}>
              {t('DateMessage', {
                fromDate: formatReservationSummaryDate(summary.from),
                toDate: formatReservationSummaryDate(summary.to),
                nights: summary.nights,
              })}
            </Text>
            <Text style={text}>
              {t('BedsMessage', { bedsCount: summary.bedsReserved })}
            </Text>

            <Text style={sectionTitle}>{t('PriceSectionTitle')}</Text>
            <Text style={text}>
              {t('AccommodationPriceMessage', {
                nights: summary.nights,
                bedsCount: summary.bedsReserved,
                pricePerNight: summary.pricePerNight,
                accommodationTotal: priceBreakdown.accommodation,
              })}
            </Text>
            <Text style={text}>
              {t('ReservationFeeMessage', {
                reservationFee: priceBreakdown.reservationFee,
              })}
            </Text>
            <Text style={text}>
              {t('GrandTotalMessage', {
                grandTotal: priceBreakdown.grandTotal,
              })}
            </Text>

            <Text style={sectionTitle}>{t('CottageContactSectionTitle')}</Text>
            <Text style={text}>
              {t('CottageNameLabel', { name: summary.cottage.name })}
            </Text>
            <Text style={text}>
              {t('CottageAddressLabel', {
                address: summary.cottage.address,
              })}
            </Text>
            <Text style={text}>
              {t('CottageEmailLabel', {
                email: formatOptionalValue(summary.cottage.email),
              })}
            </Text>
            <Text style={text}>
              {t('CottagePhoneLabel', {
                phoneNumber: formatOptionalValue(summary.cottage.phoneNumber),
              })}
            </Text>
            {summary.cottage.website && (
              <Text style={text}>
                {t('CottageWebsiteLabel', {
                  website: summary.cottage.website,
                })}
              </Text>
            )}

            <Text style={sectionTitle}>{t('GuestContactSectionTitle')}</Text>
            <Text style={text}>
              {t('GuestNameLabel', {
                name: formatOptionalValue(summary.guest.name),
              })}
            </Text>
            <Text style={text}>
              {t('GuestEmailLabel', {
                email: formatOptionalValue(summary.guest.email),
              })}
            </Text>
            <Text style={text}>
              {t('GuestPhoneLabel', {
                phoneNumber: formatOptionalValue(summary.guest.phoneNumber),
              })}
            </Text>

            {dashboardUrl && (
              <Button style={button} href={dashboardUrl}>
                {t('DashboardButton')}
              </Button>
            )}
            {pdfUrl && (
              <Button style={secondaryButton} href={pdfUrl}>
                {t('PdfButton')}
              </Button>
            )}

            <Text style={text}>{t('GoodbyeMessage')}</Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

ReservationCreatedEmail.PreviewProps = {
  summary: {
    id: 1,
    accessToken: 'preview-token',
    status: 'pending',
    paymentStatus: 'paid',
    from: '2024-07-15',
    to: '2024-07-17',
    nights: 2,
    bedsReserved: 2,
    pricePerNight: 25,
    accommodationTotal: 100,
    reservationFeeCents: 100,
    grandTotal: 101,
    cottage: {
      id: 1,
      name: 'Chata v Tatrách',
      address: 'Vysoké Tatry 1',
      email: 'chata@example.com',
      phoneNumber: '+421900000000',
      website: 'https://example.com',
    },
    guest: {
      name: 'Ján',
      email: 'guest@example.com',
      phoneNumber: '+421911111111',
      isLoggedIn: true,
    },
  },
  dashboardUrl: 'https://example.com/dashboard/reservations',
  pdfUrl: 'https://example.com/reservation/preview-token/confirmation.pdf',
  locale: 'sk',
};

export const renderReservationCreatedEmail = async ({
  summary,
  dashboardUrl,
  pdfUrl,
  locale = 'sk',
}: Props) =>
  render(
    <ReservationCreatedEmail
      summary={summary}
      dashboardUrl={dashboardUrl}
      pdfUrl={pdfUrl}
      locale={locale}
    />,
  );

const main = { backgroundColor: '#f6f9fc', padding: '10px 0' };

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const title = {
  ...text,
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '32px',
};

const sectionTitle = {
  ...text,
  fontSize: '18px',
  fontWeight: '600',
  marginTop: '16px',
};

const button = {
  backgroundColor: '#09090b',
  borderRadius: '4px',
  color: '#fafafa',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
  marginTop: '16px',
};

const secondaryButton = {
  ...button,
  backgroundColor: '#ffffff',
  color: '#09090b',
  border: '1px solid #d4d4d8',
  marginTop: '12px',
};
