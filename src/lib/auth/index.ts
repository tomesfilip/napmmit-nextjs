import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';

import db from '../../server/db/drizzle';
import { sessions, users, type User as DbUser } from '../../server/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'session',
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
  getUserAttributes: ({
    id,
    username,
    email,
    isEmailVerified,
    createdAt,
    updatedAt,
  }) => {
    return {
      id,
      username,
      email,
      isEmailVerified,
      createdAt,
      updatedAt,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: string;
  }
}

type DatabaseUserAttributes = Omit<DbUser, 'password'>;
