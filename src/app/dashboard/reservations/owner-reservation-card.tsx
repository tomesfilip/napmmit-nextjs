'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { OwnerReservationType } from '@/lib/appTypes';
import {
  confirmReservation,
  deleteReservation,
} from '@/lib/reservation/actions';

type Props = {
  reservation: OwnerReservationType;
};

export const OwnerReservationCard = ({ reservation }: Props) => {
  const router = useRouter();
  const t = useTranslations('Dashboard.Reservations');

  const handleCancelReservation = async (reservationId: number) => {
    const { success, error } = await deleteReservation(reservationId);
    if (success) {
      toast.success('Rezervácia bola zrušená');
      router.refresh();
    } else {
      toast.error(error);
    }
  };

  const handleConfirmReservation = async (reservationId: number) => {
    const { success, error } = await confirmReservation(reservationId);
    if (success) {
      toast.success('Rezervácia bola potvrdená');
      router.refresh();
    } else {
      toast.error(error);
    }
  };

  const isConfirmed = reservation.status === 'confirmed';

  return (
    <Card className="relative rounded-lg border bg-white p-4 shadow-xs">
      <CardHeader>
        <CardTitle className="text-xl">
          Rezervácia #{reservation.id} pre {reservation.cottage.name}
        </CardTitle>
        <Badge
          variant="outline"
          className={clsx(
            'absolute right-2 top-2 flex items-center gap-2',
            'font-normal text-black',
          )}
        >
          <div
            className={clsx(
              'size-2 shrink-0 rounded-full',
              reservation.status === 'confirmed' && 'bg-green-600',
              reservation.status === 'pending' && 'bg-yellow-500',
              reservation.status === 'cancelled' && 'bg-red-500',
            )}
          />
          {reservation.status === 'confirmed' && t('Status.Confirmed')}
          {reservation.status === 'pending' && t('Status.Pending')}
          {reservation.status === 'cancelled' && t('Status.Cancelled')}
        </Badge>
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
      </CardContent>
      <CardFooter className="gap-2 border-t-0 bg-transparent">
        <Button
          onClick={() => handleConfirmReservation(reservation.id)}
          disabled={isConfirmed}
        >
          {t('Actions.Confirm')}
        </Button>
        <Button
          variant="outline"
          className="text-black transition-colors duration-200 ease-in-out hover:bg-destructive/10"
          onClick={() => handleCancelReservation(reservation.id)}
        >
          {t('Actions.Cancel')}
        </Button>
      </CardFooter>
    </Card>
  );
};
