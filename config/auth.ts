import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { DatabaseUser, Lucia } from 'lucia';

import db from '../db/drizzle';
import { sessions, users } from '../db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: ({ username, email }) => {
    return {
      username,
      email,
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

type DatabaseUserAttributes = {
  id: number;
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
  createdAt: string;
  updateAt: string;
  emailVerifiedAt: Date;
  role: string;
};
