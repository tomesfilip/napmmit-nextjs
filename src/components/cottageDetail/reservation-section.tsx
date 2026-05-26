'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInDays, format } from 'date-fns';
import type { User } from 'lucia';
import { CalendarIcon, Users } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useRef, useState, useTransition } from 'react';
import type { DateRange, Matcher } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { CottageDetailType } from '@/lib/appTypes';
import type { AvailabilityResponseType } from '@/lib/availability';
import { checkAvailability } from '@/lib/availability/actions';
import { cottageAvailabilityQueryKey } from '@/lib/query';
import {
  type CreateReservationInput,
  createReservation,
} from '@/lib/reservation/actions';
import {
  formatReservationDate,
  getDefaultReservationDateRange,
  parseReservationDateParam,
  RESERVATION_DATE_PARAM_FORMAT,
} from '@/lib/reservation-date-range';

type ReservationSectionProps = CottageDetailType & {
  user: User | null;
  initialAvailability: AvailabilityResponseType[];
  urlRangeFrom: string;
  urlRangeTo: string;
};

export const ReservationSection = ({
  id,
  unAvailabilityDates,
  totalBeds,
  pricePerNight,
  user,
  initialAvailability,
  urlRangeFrom,
  urlRangeTo,
}: ReservationSectionProps) => {
  const t = useTranslations('CottageDetail');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const fromStr = searchParams.get('from');
  const toStr = searchParams.get('to');

  const [guests, setGuests] = useState(1);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [datesPopoverOpen, setDatesPopoverOpen] = useState(false);
  const [draftDateRange, setDraftDateRange] = useState<DateRange | undefined>();
  const guestsInputRef = useRef<HTMLInputElement>(null);
  const focusGuestsAfterPopoverClose = useRef(false);

  const currency = '€';

  const dateRange = useMemo((): DateRange | undefined => {
    if (!fromStr || !toStr) return undefined;
    const from = parseReservationDateParam(fromStr);
    const to = parseReservationDateParam(toStr);
    if (!from || !to) return undefined;
    return { from, to };
  }, [fromStr, toStr]);

  const initialMatchesUrl = fromStr === urlRangeFrom && toStr === urlRangeTo;

  const { data: availabilityByDate = [], isFetching } = useQuery({
    queryKey: cottageAvailabilityQueryKey(id, fromStr, toStr),
    queryFn: () => {
      if (!fromStr || !toStr) {
        throw new Error('Missing date range');
      }
      if (
        !parseReservationDateParam(fromStr) ||
        !parseReservationDateParam(toStr)
      ) {
        throw new Error('Invalid date range');
      }
      return checkAvailability(id, fromStr, toStr);
    },
    enabled: Boolean(
      fromStr &&
        toStr &&
        parseReservationDateParam(fromStr) &&
        parseReservationDateParam(toStr),
    ),
    initialData: initialMatchesUrl ? initialAvailability : undefined,
  });

  const isCheckingAvailability = isFetching;

  const commitRangeToUrl = useCallback(
    (range: DateRange) => {
      if (!range.from || !range.to) return;
      const next = new URLSearchParams(searchParams.toString());
      next.set('from', format(range.from, RESERVATION_DATE_PARAM_FORMAT));
      next.set('to', format(range.to, RESERVATION_DATE_PARAM_FORMAT));
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const onDatesPopoverOpenChange = useCallback(
    (open: boolean) => {
      setDatesPopoverOpen(open);
      if (open) {
        setDraftDateRange(
          dateRange?.from
            ? {
                from: dateRange.from,
                to: dateRange.to,
              }
            : undefined,
        );
      }
    },
    [dateRange],
  );

  const handleConfirmDates = useCallback(() => {
    if (!draftDateRange?.from || !draftDateRange.to) return;
    focusGuestsAfterPopoverClose.current = true;
    commitRangeToUrl(draftDateRange);
    setDatesPopoverOpen(false);
  }, [commitRangeToUrl, draftDateRange]);

  const onDatesPopoverCloseAutoFocus = useCallback((event: Event) => {
    if (!focusGuestsAfterPopoverClose.current) return;
    event.preventDefault();
    focusGuestsAfterPopoverClose.current = false;
    guestsInputRef.current?.focus();
  }, []);

  const disabledDates = useMemo<Matcher[]>(() => {
    const matchers: Matcher[] = [];
    if (unAvailabilityDates && unAvailabilityDates.length > 0) {
      matchers.push(...unAvailabilityDates);
    }
    return matchers;
  }, [unAvailabilityDates]);

  const totalPrice = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return 0;
    }
    const nights = differenceInDays(dateRange.to, dateRange.from);
    return nights * pricePerNight * guests;
  }, [dateRange, guests, pricePerNight]);

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const minAvailableBedsInRange = useMemo(() => {
    if (!availabilityByDate.length) return null;
    return Math.min(...availabilityByDate.map((d) => d.availableBeds));
  }, [availabilityByDate]);

  const bedsAvailableCount = useMemo(() => {
    if (dateRange?.from && dateRange?.to && minAvailableBedsInRange !== null) {
      return minAvailableBedsInRange;
    }
    return totalBeds;
  }, [dateRange, minAvailableBedsInRange, totalBeds]);

  const isAvailable = useMemo(() => {
    if (minAvailableBedsInRange === null) return false;
    return minAvailableBedsInRange > 0 && guests <= minAvailableBedsInRange;
  }, [guests, minAvailableBedsInRange]);

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

    if (!isAvailable) {
      setError('beds_not_available');
      return;
    }

    setError(null);
    setSuccess(false);

    const input: CreateReservationInput = {
      cottageId: id,
      from: formatReservationDate(dateRange.from),
      to: formatReservationDate(dateRange.to),
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
        setGuests(1);
        setGuestEmail('');
        setGuestPhone('');
        const def = getDefaultReservationDateRange();
        queryClient.invalidateQueries({
          queryKey: ['cottageAvailability', id],
        });
        router.replace(`${pathname}?from=${def.fromParam}&to=${def.toParam}`, {
          scroll: false,
        });
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
      case 'beds_not_available':
        return t('ErrorBedsNotAvailable');
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
      default:
        return t('ErrorReservationFailed');
    }
  };

  return (
    <section className="rounded-lg border bg-white p-6 shadow-xs xl:col-span-5 2xl:col-span-4">
      <h2 className="mb-4 text-xl font-semibold">{t('Reservation')}</h2>

      <div className="max-w-[400px] space-y-4">
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            <p className="whitespace-pre-line">{t('ReservationSuccess')}</p>
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
          <Popover
            open={datesPopoverOpen}
            onOpenChange={onDatesPopoverOpenChange}
          >
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
            <PopoverContent
              className="w-auto p-0"
              align="start"
              onCloseAutoFocus={onDatesPopoverCloseAutoFocus}
            >
              <div className="flex flex-col">
                <Calendar
                  mode="range"
                  defaultMonth={draftDateRange?.from ?? dateRange?.from}
                  selected={draftDateRange}
                  onSelect={setDraftDateRange}
                  numberOfMonths={2}
                  disabled={disabledDates}
                />
                <div className="flex justify-end border-t p-3">
                  <Button
                    type="button"
                    size="sm"
                    disabled={!draftDateRange?.from || !draftDateRange.to}
                    onClick={handleConfirmDates}
                  >
                    {t('ConfirmDates')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="guests" className="text-sm font-medium">
            {t('Guests2-4')}&nbsp;
            <span className="text-sm text-gray-500">
              {isCheckingAvailability
                ? '(Checking availability...)'
                : `(${t('BedsAvailable', { count: bedsAvailableCount })})`}
            </span>
          </Label>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Input
              ref={guestsInputRef}
              id="guests"
              type="number"
              min="1"
              max={bedsAvailableCount}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
              className="w-20"
              disabled={isCheckingAvailability}
            />
            <span className="text-sm text-gray-500">
              {getGuestsLabel(guests)}
            </span>
          </div>
          {!isAvailable &&
            minAvailableBedsInRange === 0 &&
            dateRange?.from &&
            dateRange?.to && (
              <p className="mt-1 text-sm text-red-500">
                {t('NoBedsAvailable')}
              </p>
            )}
          {!isAvailable &&
            minAvailableBedsInRange !== null &&
            minAvailableBedsInRange > 0 && (
              <p className="mt-1 text-sm text-red-500">
                {t('OnlyBedsAvailable', { count: minAvailableBedsInRange })}
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
                {nights === 1 ? 'noc' : nights < 5 ? 'noci' : 'nocí'} ×{' '}
                {guests} {getGuestsLabel(guests).toLowerCase()}
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
            isCheckingAvailability ||
            (!user && !guestEmail && !guestPhone)
          }
        >
          {isPending
            ? t('ReservationProcessing')
            : isCheckingAvailability
              ? 'Checking availability...'
              : t('Reserve')}
        </Button>
      </div>
    </section>
  );
};
