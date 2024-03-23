import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { DatabaseUser, Lucia, TimeSpan } from 'lucia';

import db from '../db/drizzle';
import { sessions, users, type User as DbUser } from '../db/schema';

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
    username,
    email,
    emailVerifiedAt,
    createdAt,
    updatedAt,
  }) => {
    return {
      username,
      email,
      emailVerifiedAt,
      createdAt,
      updatedAt,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
}

type DatabaseUserAttributes = Omit<DbUser, 'password'>;
