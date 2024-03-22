import { date, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  password: varchar('password', { length: 50 }).notNull(),
  username: varchar('username', { length: 50 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  emailVerifiedAt: date('email_verified_at'),
});
