import { APP_TITLE } from '@/lib/constants';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { render } from '@react-email/render';
import { format } from 'date-fns';
import { createTranslator } from 'next-intl';
import { HikerReservationType } from '../appTypes';

type Props = { 
  reservation: HikerReservationType;
  locale?: string;
};

export default async function ReservationCreatedEmail({ reservation, locale = 'sk' }: Props) {
  const t = createTranslator({
    messages: await import(`../../../messages/${locale}.json`),
    namespace: 'EmailTemplates.ReservationCreated',
    locale,
  });

  return (
    <Html>
      <Head />
      <Preview>
        {t('Preview', { cottageName: reservation.cottage.name })}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <div>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>
              {t('IntroMessage', { guestName: reservation.guestEmail ?? reservation.userId ?? 'there' })}
            </Text>
            <Text style={text}>
              {t('MainMessage', { cottageName: reservation.cottage.name })}
            </Text>
            <Text style={text}>
              {t('PendingMessage')}
            </Text>
            <Text style={text}>
              {t('DateMessage', {
                fromDate: format(new Date(reservation.from), 'dd.MM.yyyy'),
                toDate: format(new Date(reservation.to), 'dd.MM.yyyy')
              })}
            </Text>
            <Text style={text}>
              {t('DetailsMessage', {
                bedsCount: reservation.bedsReserved,
                totalPrice: reservation.totalPrice
              })}
            </Text>
            <Text style={text}>{t('GoodbyeMessage')}</Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

ReservationCreatedEmail.PreviewProps = {
  reservation: {
    cottage: { name: 'Chata v Tatrách' },
    guestEmail: 'guest@example.com',
    userId: null,
    from: '2024-07-15',
    to: '2024-07-17',
    bedsReserved: 2,
    totalPrice: 100,
  },
  locale: 'sk',
};

export const renderReservationCreatedEmail = async ({ reservation, locale = 'sk' }: Props) =>
  render(<ReservationCreatedEmail reservation={reservation} locale={locale} />);

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
