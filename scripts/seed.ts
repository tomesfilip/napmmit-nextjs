import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from '../src/server/db/schema';

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error('DB_URL environment variable is not defined.');
}

const sql = neon(DB_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log('Seeding the database');

    await db.delete(schema.cottages);
    await db.delete(schema.users);

    await db.insert(schema.users).values([
      {
        id: 1,
        email: 'admin@example.com',
        password:
          'dc2408a56bac9ea737f8ed4aac2d1bcb319a1bc285caddb81ebed43fee6bfe66',
        username: 'admin',
        phoneNumber: '123-456-7890',
        emailVerifiedAt: null,
        role: 'admin',
      },
    ]);

    await db.insert(schema.cottages).values([
      {
        id: 1,
        name: 'Mountain Lodge',
        location: 'Mount Everest Base Camp',
        totalBeds: 10,
        availableBeds: 5,
        pricePerNight: 100,
        lowPricePerNight: 80,
        breakfastPrice: 15,
        dinnerPrice: 20,
        userId: 1,
        hasBreakfast: true,
        hasDinner: true,
        hasShower: true,
      },
      {
        id: 2,
        name: 'Forest Retreat',
        location: 'Black Forest, Germany',
        totalBeds: 8,
        availableBeds: 3,
        pricePerNight: 120,
        lowPricePerNight: 100,
        userId: 1,
        hasBreakfast: false,
        hasDinner: false,
        hasShower: true,
      },
      {
        id: 3,
        name: 'Cozy Cabin',
        location: 'Yosemite National Park, USA',
        totalBeds: 6,
        availableBeds: 4,
        pricePerNight: 150,
        lowPricePerNight: 130,
        breakfastPrice: 20,
        dinnerPrice: 30,
        userId: 1,
        hasBreakfast: true,
        hasDinner: true,
        hasShower: true,
      },
      {
        id: 4,
        name: 'Alpine Chalet',
        location: 'Swiss Alps, Switzerland',
        totalBeds: 12,
        availableBeds: 10,
        pricePerNight: 200,
        lowPricePerNight: 180,
        dinnerPrice: 35,
        userId: 1,
        hasBreakfast: false,
        hasDinner: true,
        hasShower: true,
      },
    ]);

    console.log('Seeding of the database finished');
  } catch (error) {
    console.error(error);
  }
};

main();
