import {
  getReservationDateStrings,
  parseReservationDateParam,
} from '@/lib/reservation-date-range';

export type AvailabilityResponseType = {
  date: Date;
  availableBeds: number;
};

export type AvailabilityReservation = {
  from: string;
  to: string;
  bedsReserved: number;
  status: string;
};

export const AVAILABILITY_BLOCKING_STATUSES = ['pending', 'confirmed'] as const;

export function isAvailabilityBlockingStatus(status: string) {
  return AVAILABILITY_BLOCKING_STATUSES.some(
    (blockingStatus) => blockingStatus === status,
  );
}

export function calculateDailyAvailability(
  totalBeds: number,
  checkIn: Date,
  checkOut: Date,
  reservationsToCheck: AvailabilityReservation[],
): AvailabilityResponseType[] {
  if (totalBeds <= 0) {
    throw new Error('totalBeds must be positive');
  }
  if (checkIn >= checkOut) {
    throw new Error('checkIn must be before checkOut');
  }

  return getReservationDateStrings(checkIn, checkOut).map((dateStr) => {
    const reservedOnDate = reservationsToCheck
      .filter(
        (res) =>
          isAvailabilityBlockingStatus(res.status) &&
          res.from <= dateStr &&
          res.to > dateStr,
      )
      .reduce((sum, res) => sum + res.bedsReserved, 0);

    return {
      date: parseReservationDateParam(dateStr) ?? new Date(dateStr),
      availableBeds: Math.max(0, totalBeds - reservedOnDate),
    };
  });
}
