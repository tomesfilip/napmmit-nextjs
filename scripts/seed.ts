import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

import { SERVICES } from '@/lib/constants';
import * as schema from '../src/server/db/schema';

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

const cottageData = [
  {
    id: 1,
    name: 'Holubyho chata',
    location: 'Vysoké Tatry',
    totalBeds: 10,
    availableBeds: 5,
    pricePerNight: 100,
    lowPricePerNight: 80,
    breakfastPrice: 15,
    dinnerPrice: 20,
    userId: '1',
  },
  {
    id: 2,
    name: 'Chata na Grúni',
    location: 'Malá Fatra',
    totalBeds: 8,
    availableBeds: 3,
    pricePerNight: 120,
    lowPricePerNight: 100,
    userId: '1',
  },
  {
    id: 3,
    name: 'Chata Martinské hole',
    location: 'Malá Fatra',
    totalBeds: 6,
    availableBeds: 4,
    pricePerNight: 150,
    lowPricePerNight: 130,
    breakfastPrice: 20,
    dinnerPrice: 30,
    userId: '1',
  },
  {
    id: 4,
    name: 'Chata pod Chlebom',
    location: 'Malá Fatra',
    totalBeds: 12,
    availableBeds: 10,
    pricePerNight: 200,
    lowPricePerNight: 180,
    dinnerPrice: 35,
    userId: '1',
  },
  {
    id: 5,
    name: 'Chata pod Kľačianskou Magurou',
    location: 'Malá Fatra',
    totalBeds: 12,
    availableBeds: 10,
    pricePerNight: 200,
    lowPricePerNight: 180,
    dinnerPrice: 35,
    userId: '1',
  },
  {
    id: 6,
    name: 'Chata Vrátna',
    location: 'Malá Fatra',
    totalBeds: 12,
    availableBeds: 10,
    pricePerNight: 200,
    lowPricePerNight: 180,
    dinnerPrice: 35,
    userId: '1',
  },
  {
    id: 7,
    name: 'Chata pod Kráľovou hoľou',
    location: 'Nízke Tatry',
    totalBeds: 12,
    availableBeds: 10,
    pricePerNight: 200,
    lowPricePerNight: 180,
    dinnerPrice: 35,
    userId: '1',
  },
  {
    id: 8,
    name: 'Chata generála M. R. Štefánika pod Ďumbierom',
    location: 'Nízke Tatry',
    totalBeds: 12,
    availableBeds: 10,
    pricePerNight: 200,
    lowPricePerNight: 180,
    dinnerPrice: 35,
    userId: '1',
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

    await db.delete(schema.cottages);
    await db.delete(schema.users);
    await db.delete(schema.services);
    await db.delete(schema.cottageServices);

    await db.insert(schema.users).values(userData);
    await db.insert(schema.cottages).values(cottageData);
    await db
      .insert(schema.services)
      .values(SERVICES.map(({ name }) => ({ name: name })));
    await db.insert(schema.cottageServices).values(cottageServiceData);

    console.log('Seeding of the database finished');
  } catch (error) {
    console.error(error);
  }
};

main();
