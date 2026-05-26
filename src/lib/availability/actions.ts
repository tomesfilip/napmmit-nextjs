'use server';

import { getAvailableBeds } from '@/lib/availability';

export async function checkAvailability(
  cottageId: number,
  checkIn: Date,
  checkOut: Date,
) {
  return getAvailableBeds(cottageId, checkIn, checkOut);
}
