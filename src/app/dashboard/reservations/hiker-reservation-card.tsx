import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HikerReservationType } from '@/lib/appTypes';
import { format } from 'date-fns';

type Props = {
  reservation: HikerReservationType;
};

export const HikerReservationCard = ({ reservation }: Props) => {
  return (
    <Card className="rounded-lg border bg-white p-4 shadow-sm">
      <CardHeader>
        <CardTitle>{reservation.cottage.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <span className="font-medium">Termín:</span>{' '}
          {format(new Date(reservation.from), 'dd.MM.yyyy')} -{' '}
          {format(new Date(reservation.to), 'dd.MM.yyyy')}
        </p>
        <p>
          <span className="font-medium">Lôžka:</span> {reservation.bedsReserved}
        </p>
        <p>
          <span className="font-medium">Celková cena:</span>{' '}
          {reservation.totalPrice} €
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={
              reservation.status === 'confirmed'
                ? 'text-green-600'
                : reservation.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }
          >
            {reservation.status === 'confirmed'
              ? 'Potvrdené'
              : reservation.status === 'pending'
                ? 'Čakajúce'
                : 'Zrušené'}
          </span>
        </p>
        {reservation.guestEmail && (
          <p>
            <span className="font-medium">Email:</span> {reservation.guestEmail}
          </p>
        )}
        {reservation.guestPhone && (
          <p>
            <span className="font-medium">Telefón:</span>{' '}
            {reservation.guestPhone}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button>Zrušiť rezerváciu</Button>
      </CardFooter>
    </Card>
  );
};
