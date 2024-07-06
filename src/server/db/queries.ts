'use server';

import { CottageWithServices } from '@/lib/appTypes';
import { cache } from 'react';
import db from './drizzle';

export const getCottages = cache(
  async (): Promise<{ success?: CottageWithServices[]; error?: string }> => {
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

      const normalizedData = data.map((cottage) => ({
        ...cottage,
        cottageServices: cottage.cottageServices.map((cs) => ({
          ...cs.service,
        })),
      }));

      return { success: normalizedData };
    } catch (err) {
      return { error: "Couldn't find any cottages." };
    }
  },
);
