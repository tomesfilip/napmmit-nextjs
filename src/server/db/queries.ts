import { cache } from 'react';
import db from './drizzle';

export const getCottages = cache(async () => {
  const data = await db.query.cottages.findMany();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return data;
});
