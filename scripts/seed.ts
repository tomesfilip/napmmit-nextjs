import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

import { SERVICES } from '@/lib/constants';
import * as schema from '../src/server/db/schema';
import { cottageData } from './data/cottages';
import { imageData } from './data/images';

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error('DB_URL environment variable is not defined.');
}

const sql = neon(DB_URL);
const db = drizzle(sql, { schema });

const userData = [
  {
    id: '1',
    email: 'admin@example.com',
    password:
      'dc2408a56bac9ea737f8ed4aac2d1bcb319a1bc285caddb81ebed43fee6bfe66',
    username: 'admin',
    phoneNumber: '123-456-7890',
    isEmailVerified: false,
    role: 'admin',
  },
];

const cottageServiceData: schema.CottageService[] = [];

const assignServicesToCottages = () => {
  cottageData.forEach((cottage) => {
    const numServices = Math.floor(Math.random() * SERVICES.length);
    const cottageServices: schema.CottageService[] = [];

    const selectedServices = new Set<number>();
    while (selectedServices.size < numServices) {
      selectedServices.add(Math.floor(Math.random() * SERVICES.length));
    }

    selectedServices.forEach((serviceIndex) => {
      cottageServices.push({
        cottageId: cottage.id,
        serviceId: serviceIndex + 1,
      });
    });

    cottageServiceData.push(...cottageServices);
  });
};

assignServicesToCottages();

const main = async () => {
  try {
    console.log('Seeding the database');

    await db.delete(schema.users);
    await db.delete(schema.cottageServices);
    await db.delete(schema.services);
    await db.delete(schema.images);
    await db.delete(schema.cottages);

    await db.insert(schema.users).values(userData);
    await db.insert(schema.cottages).values(cottageData);
    await db.insert(schema.images).values(imageData);
    await db
      .insert(schema.services)
      .values(
        SERVICES.map(({ name, icon }, index) => ({
          id: index + 1,
          name: name,
          icon: icon,
        })),
      );
    await db.insert(schema.cottageServices).values(cottageServiceData);

    console.log('Seeding of the database finished');
  } catch (error) {
    console.error(error);
  }
};

main();
