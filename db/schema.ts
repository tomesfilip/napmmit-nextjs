import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  password: text('password').notNull(),
  username: varchar('username', { length: 50 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  emailVerifiedAt: date('email_verified_at'),
  role: varchar('role', { length: 20 }).notNull(),
});

export const cottages = pgTable('cottages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  totalBeds: integer('total_beds').notNull(),
  availableBeds: integer('available_beds').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  lowPricePerNight: integer('low_price_per_night'),
  breakfastPrice: integer('breakfast_price'),
  dinnerPrice: integer('dinner_price'),
  userId: integer('userId').notNull(),
  hasBreakfast: boolean('has_breakfast'),
  hasDinner: boolean('has_dinner'),
  hasShower: boolean('has_shower'),
});

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  cottageId: integer('cottage_id').notNull(),
  from: date('from').notNull(),
  to: date('to').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  totalPrice: integer('total_price').notNull(),
  created: date('created').notNull(),
  status: varchar('status', { length: 255 }).notNull(),
});

// TODO: Could be better to use separate table for the pricing options
// export const pricingOptions = pgTable('pricing_options', {
//   id: integer('id').primaryKey().notNull(),
//   price_type: varchar('price_type', { length: 20 }).notNull(),
//   price: decimal('price', { precision: 2 }).notNull(),
//   cottage_id: integer('cottage_id').notNull(),
// });

export const usersRelations = relations(users, ({ many }) => ({
  cottages: many(cottages),
  reservations: many(reservations),
}));

export const cottagesRelations = relations(cottages, ({ many, one }) => ({
  reservations: many(reservations),
  user: one(users, { fields: [cottages.userId], references: [users.id] }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, { fields: [reservations.userId], references: [users.id] }),
  cottage: one(cottages, {
    fields: [reservations.cottageId],
    references: [cottages.id],
  }),
}));
