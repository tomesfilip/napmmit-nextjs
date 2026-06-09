'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { HikerReservationType } from '@/lib/appTypes';
import { deleteReservation } from '@/lib/reservation/actions';

type Props = {
  reservation: HikerReservationType;
};

export const HikerReservationCard = ({ reservation }: Props) => {
  const t = useTranslations('Dashboard');

  const handleCancelReservation = async (reservationId: number) => {
    const result = await deleteReservation(reservationId);
    if ('success' in result) {
      toast.success('Rezervácia bola zrušená');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Card className="rounded-lg border bg-white p-4 shadow-xs">
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
        {reservation.paymentStatus === 'refund_failed' && (
          <p className="text-red-600">
            Refundácia zlyhala. Kontaktujte prosím podporu.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => handleCancelReservation(reservation.id)}
          disabled={reservation.status === 'cancelled'}
        >
          {t('Reservations.Actions.Cancel')}
        </Button>
      </CardFooter>
    </Card>
  );
};
