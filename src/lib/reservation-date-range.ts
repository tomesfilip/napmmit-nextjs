import { addDays, format, startOfDay } from 'date-fns';

export const RESERVATION_DATE_PARAM_FORMAT = 'yyyy-MM-dd';

/** Check-in = today (local), check-out = 7 days later (exclusive end for availability query). */
export function getDefaultReservationDateRange(now = new Date()) {
  const from = startOfDay(now);
  const to = addDays(from, 7);
  return {
    from,
    to,
    fromParam: format(from, RESERVATION_DATE_PARAM_FORMAT),
    toParam: format(to, RESERVATION_DATE_PARAM_FORMAT),
  };
}

export function parseReservationDateParam(ymd: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

export function isValidReservationRange(from: Date, to: Date) {
  return from.getTime() < to.getTime();
}
