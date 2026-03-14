import { APP_TITLE, EMAIL_SUPPORT } from '@/lib/constants';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { render } from '@react-email/render';
import { getTranslations } from 'next-intl/server';
import { HikerReservationType } from '../appTypes';

type Props = { reservation: HikerReservationType };

export const ReservationCancelledEmail = async ({ reservation }: Props) => {
  const t = await getTranslations('EmailTemplates.ReservationCancelled');

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
              {t('SupportMessage', { supportEmail: EMAIL_SUPPORT })}
            </Text>
            <Text style={text}>{t('GoodbyeMessage')}</Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export const renderReservationCancelledEmail = ({ reservation }: Props) =>
  render(<ReservationCancelledEmail reservation={reservation} />);

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
