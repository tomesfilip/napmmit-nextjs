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
            columns: { serviceId: false },
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

export const getCottage = cache(
  async (
    id: number,
  ): Promise<{ success?: CottageWithServices; error?: string }> => {
    try {
      const data = await db.query.cottages.findFirst({
        with: {
          cottageServices: {
            with: { service: { columns: { id: true, name: true } } },
          },
        },
        where: (table, funcs) => funcs.eq(table.id, Number(id)),
      });

      if (!data) {
        return { error: "Couldn't find the specified cottage." };
      }

      const normalizedData = {
        ...data,
        cottageServices: data.cottageServices.map((cs) => ({
          ...cs.service,
        })),
      };

      return { success: normalizedData };
    } catch (error) {
      return { error: "Couldn't find the specified cottage." };
    }
  },
);
