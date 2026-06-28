import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import db from '../../server/db/drizzle';
import { type User as DbUser, sessions, users } from '../../server/db/schema';
import { createLucia } from './lucia-config';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = createLucia(adapter);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: string;
  }
}

type DatabaseUserAttributes = Omit<DbUser, 'password'>;
