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
import { HikerReservationType } from '../appTypes';

type Props = { reservation: HikerReservationType };

export const ReservationCreatedEmail = ({ reservation }: Props) => {
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
              Your reservation for {reservation.cottage.name} has been created
              successfully.
            </Text>
            <Text style={text}>
              The reservation is pending confirmation. You will be notified when
              it is confirmed.
            </Text>
            <Text style={text}>
              The reservation is from{' '}
              {format(new Date(reservation.from), 'dd.MM.yyyy')} to{' '}
              {format(new Date(reservation.to), 'dd.MM.yyyy')}
            </Text>
            <Text style={text}>
              The reservation is for {reservation.bedsReserved} beds for a total
              price of {reservation.totalPrice} €.
            </Text>
            <Text style={text}>Have a nice day!</Text>
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
