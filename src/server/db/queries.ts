import { cache } from 'react';
import db from './drizzle';

export const getCottages = cache(async () => {
  const data = await db.query.cottages.findMany();
  return data;
});
