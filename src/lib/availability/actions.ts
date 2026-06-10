'use server';

import { getAvailableBeds } from '@/lib/availability';
import {
  isValidReservationRange,
  parseReservationDateParam,
} from '@/lib/reservation-date-range';

export async function checkAvailability(
  cottageId: number,
  checkIn: string,
  checkOut: string,
) {
  const checkInDate = parseReservationDateParam(checkIn);
  const checkOutDate = parseReservationDateParam(checkOut);

  if (
    !checkInDate ||
    !checkOutDate ||
    !isValidReservationRange(checkInDate, checkOutDate)
  ) {
    return [];
  }

  return getAvailableBeds(cottageId, checkInDate, checkOutDate);
}
