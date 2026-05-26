import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
} from 'date-fns';

export const RESERVATION_DATE_PARAM_FORMAT = 'yyyy-MM-dd';

export function formatReservationDate(date: Date) {
  return format(date, RESERVATION_DATE_PARAM_FORMAT);
}

/** Check-in = today (local), check-out = 7 days later (exclusive end for availability query). */
export function getDefaultReservationDateRange(now = new Date()) {
  const from = startOfDay(now);
  const to = addDays(from, 7);
  return {
    from,
    to,
    fromParam: formatReservationDate(from),
    toParam: formatReservationDate(to),
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

export function getReservationNightCount(from: Date, to: Date) {
  return differenceInCalendarDays(to, from);
}

export function getReservationDateStrings(from: Date, to: Date) {
  const dates: string[] = [];

  for (
    let current = startOfDay(from);
    current < to;
    current = addDays(current, 1)
  ) {
    dates.push(formatReservationDate(current));
  }

  return dates;
}
