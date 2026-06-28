import type { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';

import type { User as DbUser } from '@/server/db/schema';

export type DatabaseUserAttributes = Omit<DbUser, 'password'>;

export function createLucia(adapter: DrizzlePostgreSQLAdapter) {
  return new Lucia(adapter, {
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
      role,
    }) => {
      return {
        id,
        username,
        email,
        isEmailVerified,
        createdAt,
        updatedAt,
        role,
      };
    },
  });
}
