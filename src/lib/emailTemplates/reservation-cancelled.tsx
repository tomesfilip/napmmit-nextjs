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
import { HikerReservationType } from '../appTypes';

type Props = { reservation: HikerReservationType };

export const ReservationCancelledEmail = ({ reservation }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your reservation for {reservation.cottage.name} has been created
        successfully
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <div>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>
              Hi, {reservation.guestEmail ?? reservation.userId}!
            </Text>
            <Text style={text}>
              Your reservation for {reservation.cottage.name} has been cancelled
            </Text>
            <Text style={text}>
              If you have any questions, please contact us at {EMAIL_SUPPORT}.
            </Text>
            <Text style={text}>Have a nice day!</Text>
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
