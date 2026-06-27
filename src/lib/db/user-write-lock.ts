import { sql } from 'drizzle-orm';
import type db from '@/server/db/drizzle';

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function acquireUserWriteLock(
  tx: DbTransaction,
  userId: string,
): Promise<void> {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);
}
