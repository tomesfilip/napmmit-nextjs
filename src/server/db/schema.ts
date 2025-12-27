import { IconType } from '@/lib/appTypes';
import { PASSWORD_ID_LENGTH, USER_ID_LENGTH } from '@/lib/constants';
import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: USER_ID_LENGTH }).primaryKey(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: text('password').notNull(),
  username: varchar('username', { length: 50 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isEmailVerified: boolean('is_email_verified'),
  role: varchar('role', { length: 20 }).notNull(),
});

export const cottages = pgTable('cottages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'),
  address: varchar('address').notNull(),
  mountainArea: varchar('mountain_area', { length: 255 }).notNull(),
  capacity: integer('capacity').notNull(),
  availableBeds: integer('available_beds').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  priceLowPerNight: integer('price_low_per_night'),
  priceBreakfast: integer('price_breakfast'),
  priceDinner: integer('price_dinner'),
  phoneNumber: varchar('phone_number'),
  email: varchar('email'),
  website: varchar('website'),
  userId: varchar('userId', { length: USER_ID_LENGTH })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  locationURL: varchar('locationURL'),
});

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: USER_ID_LENGTH })
    .notNull()
    .references(() => users.id),
  cottageId: integer('cottage_id')
    .notNull()
    .references(() => cottages.id, { onDelete: 'cascade' }),
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
  cottageServices: many(cottageServices),
  images: many(images),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, { fields: [reservations.userId], references: [users.id] }),
  cottage: one(cottages, {
    fields: [reservations.cottageId],
    references: [cottages.id],
  }),
}));

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: varchar('user_id', { length: USER_ID_LENGTH })
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const emailVerificationCodes = pgTable('email_verification_codes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: USER_ID_LENGTH })
    .unique()
    .notNull()
    .references(() => users.id),
  email: varchar('email', { length: 100 })
    .notNull()
    .references(() => users.email),
  code: varchar('code', { length: 8 }).notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: varchar('id', { length: PASSWORD_ID_LENGTH }).primaryKey(),
  userId: varchar('user_id', { length: USER_ID_LENGTH })
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name').unique().notNull(),
  icon: varchar('icon').notNull().$type<IconType>(),
});

export const servicesRelations = relations(services, ({ many }) => ({
  cottages: many(cottageServices),
}));

export const cottageServices = pgTable(
  'cottage_services',
  {
    cottageId: integer('cottage_id')
      .notNull()
      .references(() => cottages.id, { onDelete: 'cascade' }),
    serviceId: integer('service_id')
      .notNull()
      .references(() => services.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.cottageId, t.serviceId] }) }),
);

export const cottageServicesRelations = relations(
  cottageServices,
  ({ one }) => ({
    cottage: one(cottages, {
      fields: [cottageServices.cottageId],
      references: [cottages.id],
    }),
    service: one(services, {
      fields: [cottageServices.serviceId],
      references: [services.id],
    }),
  }),
);

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  cottageId: integer('cottage_id')
    .notNull()
    .references(() => cottages.id, { onDelete: 'cascade' }),
  src: varchar('src', { length: 255 }).notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const imagesRelations = relations(images, ({ one }) => ({
  cottages: one(cottages, {
    fields: [images.cottageId],
    references: [cottages.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Cottage = typeof cottages.$inferSelect;
export type Service = typeof services.$inferSelect;
export type CottageService = typeof cottageServices.$inferSelect;
export type ImageType = typeof images.$inferSelect;
