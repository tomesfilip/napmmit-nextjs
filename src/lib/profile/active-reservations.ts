import { and, count, eq, inArray } from 'drizzle-orm';
import db from '@/server/db/drizzle';
import { cottages, reservations } from '@/server/db/schema';

export const ACTIVE_RESERVATION_STATUSES = ['pending', 'confirmed'] as const;

export function isActiveReservationStatus(
  status: string,
): status is (typeof ACTIVE_RESERVATION_STATUSES)[number] {
  return status === 'pending' || status === 'confirmed';
}

export async function getActiveReservationCount(
  userId: string,
): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(reservations)
    .where(
      and(
        eq(reservations.userId, userId),
        inArray(reservations.status, [...ACTIVE_RESERVATION_STATUSES]),
      ),
    );

  return result?.count ?? 0;
}

export async function getOwnedCottageCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(cottages)
    .where(eq(cottages.userId, userId));

  return result?.count ?? 0;
}
