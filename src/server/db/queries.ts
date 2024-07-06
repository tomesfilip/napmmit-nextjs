import { cache } from 'react';
import db from './drizzle';

export const getCottages = cache(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await db.query.cottages.findMany({
      with: {
        cottageServices: {
          columns: { cottageId: false, serviceId: false },
          with: { service: { columns: { id: true, name: true } } },
        },
      },
    });
    return { success: data };
  } catch (err) {
    return { error: "Couldn't find any cottages." };
  }
});
