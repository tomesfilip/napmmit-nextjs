import {
  formatReservationDate,
  getReservationDateStrings,
  getReservationNightCount,
  isValidReservationRange,
  parseReservationDateParam,
} from '@/lib/reservation-date-range';

export type ReservationValidationInput = {
  userId?: string | null;
  cottageId: number;
  from: string;
  to: string;
  bedsReserved: number;
  totalPrice: number;
  guestEmail?: string;
  guestPhone?: string;
};

export type ValidatedReservationInput = ReservationValidationInput & {
  userId: string | null;
  fromISO: string;
  toISO: string;
  pricePerNight: number;
  reservationDates: string[];
};

export function validateReservationInputData(
  data: ReservationValidationInput,
): { success: true; data: ValidatedReservationInput } | { error: string } {
  if (!data.bedsReserved || data.bedsReserved < 1) {
    return { error: 'beds_required' };
  }
  if (!data.from) {
    return { error: 'from_date_required' };
  }
  if (!data.to) {
    return { error: 'to_date_required' };
  }
  if (!data.cottageId) {
    return { error: 'cottage_id_required' };
  }
  if (typeof data.totalPrice !== 'number' || data.totalPrice < 0) {
    return { error: 'total_price_required' };
  }
  if (!data.userId && !data.guestEmail && !data.guestPhone) {
    return { error: 'missing_guest_contact' };
  }

  const dateFrom = parseReservationDateParam(data.from);
  const dateTo = parseReservationDateParam(data.to);

  if (!dateFrom || !dateTo) {
    return { error: 'invalid_dates' };
  }

  if (!isValidReservationRange(dateFrom, dateTo)) {
    return { error: 'to_date_before_from' };
  }

  const diffDays = getReservationNightCount(dateFrom, dateTo);

  return {
    success: true,
    data: {
      ...data,
      userId: data.userId ?? null,
      fromISO: formatReservationDate(dateFrom),
      toISO: formatReservationDate(dateTo),
      pricePerNight: Math.round(data.totalPrice / diffDays),
      reservationDates: getReservationDateStrings(dateFrom, dateTo),
    },
  };
}
