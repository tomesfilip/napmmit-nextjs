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
import { useTranslations } from 'next-intl';
import { HikerReservationType } from '../appTypes';

type Props = { reservation: HikerReservationType };

export const ReservationCreatedEmail = ({ reservation }: Props) => {
  const t = useTranslations('EmailTemplates.ReservationCreated');

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
};

export const renderReservationCreatedEmail = ({ reservation }: Props) =>
  render(<ReservationCreatedEmail reservation={reservation} />);

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
