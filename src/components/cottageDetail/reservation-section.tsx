'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CottageDetailType, ReservedRangeType } from '@/lib/appTypes';
import {
  createReservation,
  CreateReservationInput,
} from '@/lib/reservation/actions';
import { differenceInDays, format, isAfter, isBefore } from 'date-fns';
import type { User } from 'lucia';
import { CalendarIcon, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { DateRange, Matcher } from 'react-day-picker';

type ReservationSectionProps = CottageDetailType & {
  reservedRanges: ReservedRangeType[];
  user: User | null;
};

export const ReservationSection = ({
  id,
  unAvailabilityDates,
  availableBeds,
  pricePerNight,
  reservedRanges,
  user,
}: ReservationSectionProps) => {
  const t = useTranslations('CottageDetail');

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<number>(1);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currency = '€'; // TODO: This should come from selected currency (shared context or store)

  // Combine unavailability dates and reserved ranges into disabled dates
  const disabledDates = useMemo<Matcher[]>(() => {
    const matchers: Matcher[] = [];

    // Add unavailability dates
    if (unAvailabilityDates && unAvailabilityDates.length > 0) {
      matchers.push(...unAvailabilityDates);
    }

    // Add reserved ranges - check if date falls within any reserved range
    if (reservedRanges && reservedRanges.length > 0) {
      reservedRanges.forEach((range) => {
        const from = new Date(range.from);
        const to = new Date(range.to);
        matchers.push({
          from,
          to,
        });
      });
    }

    return matchers;
  }, [unAvailabilityDates, reservedRanges]);

  const totalPrice = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const nights = differenceInDays(dateRange.to, dateRange.from);
    return nights * pricePerNight;
  }, [dateRange, pricePerNight]);

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const isAvailable = useMemo(() => {
    return guests <= availableBeds;
  }, [guests, availableBeds]);

  const getGuestsLabel = (guests: number) => {
    if (guests === 1) {
      return t('Guest');
    }
    if (guests > 1 && guests < 5) {
      return t('Guests2-4');
    }
    return t('Guests5Plus');
  };

  const handleReservation = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setError('select_dates');
      return;
    }

    if (!user && !guestEmail && !guestPhone) {
      setError('missing_guest_contact');
      return;
    }

    setError(null);
    setSuccess(false);

    const input: CreateReservationInput = {
      cottageId: id,
      from: dateRange.from.toISOString().split('T')[0],
      to: dateRange.to.toISOString().split('T')[0],
      bedsReserved: guests,
      totalPrice,
      ...(guestEmail && { guestEmail }),
      ...(guestPhone && { guestPhone }),
    };

    startTransition(async () => {
      const result = await createReservation(input);

      if ('error' in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        setDateRange(undefined);
        setGuests(1);
        setGuestEmail('');
        setGuestPhone('');
      }
    });
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'missing_guest_contact':
        return t('ErrorMissingContact');
      case 'dates_unavailable':
        return t('ErrorDatesUnavailable');
      case 'select_dates':
        return t('ErrorSelectDates');
      case 'beds_required':
      case 'from_date_required':
      case 'to_date_required':
      case 'cottage_id_required':
      case 'total_price_required':
        return t('ErrorInvalidInput');
      case 'invalid_dates':
        return t('ErrorInvalidDates');
      case 'to_date_before_from':
        return t('ErrorToBeforeFrom');
      case 'reservation_failed':
      default:
        return t('ErrorReservationFailed');
    }
  };

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm xl:col-span-5 2xl:col-span-4">
      <h2 className="mb-4 text-xl font-semibold">{t('Reservation')}</h2>

      <div className="space-y-4">
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            {t('ReservationSuccess')}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {getErrorMessage(error)}
          </div>
        )}

        <div>
          <Label htmlFor="dates" className="text-sm font-medium">
            {t('Dates')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dates"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>{t('SelectDates')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={disabledDates}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="guests" className="text-sm font-medium">
            {t('Guests2-4')}&nbsp;
            <span className="text-sm text-gray-500">
              ({t('OnlyBedsAvailable', { count: availableBeds })})
            </span>
          </Label>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Input
              id="guests"
              type="number"
              min="1"
              max={availableBeds}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-20"
            />
            <span className="text-sm text-gray-500">
              {getGuestsLabel(guests)}
            </span>
          </div>
          {!isAvailable && (
            <p className="mt-1 text-sm text-red-500">
              {t('OnlyBedsAvailable', { count: availableBeds })}
            </p>
          )}
        </div>

        {!user && (
          <>
            <div>
              <Label htmlFor="guestEmail" className="text-sm font-medium">
                {t('GuestEmail')}
              </Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="vas@email.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="guestPhone" className="text-sm font-medium">
                {t('GuestPhone')}
              </Label>
              <Input
                id="guestPhone"
                type="tel"
                placeholder="+421 XXX XXX XXX"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
            </div>

            <p className="text-xs text-gray-500">{t('GuestContactNote')}</p>
          </>
        )}

        {totalPrice > 0 && (
          <div className="border-t pt-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                {pricePerNight} {currency} × {nights}{' '}
                {nights === 1 ? 'noc' : nights < 5 ? 'noci' : 'nocí'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('TotalPrice')}</span>
                <span className="text-lg font-semibold">
                  {totalPrice} {currency}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          className="mt-6 w-full"
          onClick={handleReservation}
          disabled={
            !dateRange?.from ||
            !dateRange?.to ||
            !isAvailable ||
            isPending ||
            (!user && !guestEmail && !guestPhone)
          }
        >
          {isPending ? t('ReservationProcessing') : t('Reserve')}
        </Button>
      </div>
    </section>
  );
};
