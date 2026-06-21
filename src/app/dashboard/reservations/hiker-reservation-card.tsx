'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { HikerReservationType } from '@/lib/appTypes';
import { ROUTES } from '@/lib/constants';
import { deleteReservation } from '@/lib/reservation/actions';

type Props = {
  reservation: HikerReservationType;
};

export const HikerReservationCard = ({ reservation }: Props) => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const getCancelErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'unauthorized':
        return t('Reservations.Errors.Unauthorized');
      case 'reservation_not_found':
        return t('Reservations.Errors.ReservationNotFound');
      case 'cancellation_cutoff_passed':
        return t('Reservations.Errors.CancellationCutoffPassed');
      case 'refund_failed':
        return t('Reservations.Errors.RefundFailed');
      case 'invalid_dates':
        return t('Reservations.Errors.InvalidDates');
      default:
        return t('Reservations.Errors.CancelFailed');
    }
  };

  const handleCancelReservation = async () => {
    setIsCancelling(true);

    try {
      const result = await deleteReservation(reservation.id);

      if ('success' in result) {
        toast.success(t('Reservations.CancelSuccess'));
        setIsCancelDialogOpen(false);
        router.refresh();
        return;
      }

      toast.error(getCancelErrorMessage(result.error));
    } catch {
      toast.error(getCancelErrorMessage('reservation_deletion_failed'));
    } finally {
      setIsCancelling(false);
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
      <CardFooter className="gap-2 border-t-0 bg-transparent">
        <Button asChild className="cursor-pointer">
          <Link href={ROUTES.DASHBOARD.RESERVATION_DETAIL(reservation.id)}>
            {t('Reservations.Actions.ViewDetails')}
          </Link>
        </Button>
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={reservation.status === 'cancelled'}
            >
              {t('Reservations.Actions.Cancel')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('Reservations.CancelDialog.Title')}</DialogTitle>
              <DialogDescription>
                {t('Reservations.CancelDialog.Description')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                  disabled={isCancelling}
                >
                  {t('Reservations.CancelDialog.DismissButton')}
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
                disabled={isCancelling}
                onClick={handleCancelReservation}
              >
                {t('Reservations.CancelDialog.ConfirmButton')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
