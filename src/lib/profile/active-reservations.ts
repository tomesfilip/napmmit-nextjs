import { and, count, eq, inArray } from 'drizzle-orm';
import type { DbTransaction } from '@/lib/db/user-write-lock';
import db from '@/server/db/drizzle';
import { cottages, reservations } from '@/server/db/schema';

export const ACTIVE_RESERVATION_STATUSES = ['pending', 'confirmed'] as const;

type DbQueryClient = typeof db | DbTransaction;

export function isActiveReservationStatus(
  status: string,
): status is (typeof ACTIVE_RESERVATION_STATUSES)[number] {
  return status === 'pending' || status === 'confirmed';
}

export async function getActiveReservationCount(
  userId: string,
  dbOrTx: DbQueryClient = db,
): Promise<number> {
  const [result] = await dbOrTx
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

export async function getOwnedCottageCount(
  userId: string,
  dbOrTx: DbQueryClient = db,
): Promise<number> {
  const [result] = await dbOrTx
    .select({ count: count() })
    .from(cottages)
    .where(eq(cottages.userId, userId));

  return result?.count ?? 0;
}
