import { and, eq, gt, lt, or } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { cottages, reservations } from '@/server/db/schema';

export type AvailabilityResponseType = {
  date: Date;
  availableBeds: number;
};

export async function getAvailableBeds(
  cottageId: number,
  checkIn: Date,
  checkOut: Date,
): Promise<AvailabilityResponseType[]> {
  const cottage = await db
    .select({ capacity: cottages.capacity })
    .from(cottages)
    .where(eq(cottages.id, cottageId))
    .then((rows) => rows[0]);

  if (!cottage) return [];

  console.log(
    'AVAILABILITY.TS: Cottage available (total) beds:',
    cottage.capacity,
  );

  const checkInStr = checkIn.toISOString().split('T')[0];
  const checkOutStr = checkOut.toISOString().split('T')[0];

  console.log('AVAILABILITY.TS: Check in:', checkInStr);
  console.log('AVAILABILITY.TS: Check out:', checkOutStr);

  // Get all reserved beds for each date in the date range and group by date
  const overlappingReservations = await db
    .select({
      from: reservations.from,
      to: reservations.to,
      bedsReserved: reservations.bedsReserved,
    })
    .from(reservations)
    .where(
      and(
        eq(reservations.cottageId, cottageId),
        or(
          eq(reservations.status, 'pending'),
          eq(reservations.status, 'confirmed'),
        ),
        lt(reservations.from, checkOutStr), // res.from < checkOut
        gt(reservations.to, checkInStr), // res.to > checkIn
      ),
    );

  const result: AvailabilityResponseType[] = [];
  const current = new Date(checkIn);

  while (current < checkOut) {
    const dateStr = current.toISOString().split('T')[0];

    // Sum bedsReserved for all reservations that cover this specific date
    const reservedOnDate = overlappingReservations
      .filter((res) => res.from <= dateStr && res.to > dateStr)
      .reduce((sum, res) => sum + res.bedsReserved, 0);

    result.push({
      date: new Date(current),
      availableBeds: cottage.capacity - reservedOnDate,
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

export async function canMakeReservation(
  cottageId: number,
  checkIn: Date,
  checkOut: Date,
  requestedBeds: number,
): Promise<boolean> {
  const availableBeds = await getAvailableBeds(cottageId, checkIn, checkOut);
  return availableBeds.some((res) => res.availableBeds >= requestedBeds);
}
