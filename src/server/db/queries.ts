'use server';

import { CottageDetailType, ReservedRangeType } from '@/lib/appTypes';
import { cache } from 'react';
import db from './drizzle';
import { ReservationType } from './schema';

export const getCottages = cache(
  async (): Promise<{ success?: CottageDetailType[]; error?: string }> => {
    try {
      // Uncomment the following line to simulate a delay for testing purposes
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const data = await db.query.cottages.findMany({
        with: {
          cottageServices: {
            columns: { serviceId: false },
            with: {
              service: { columns: { id: true, name: true, icon: true } },
            },
          },
          images: {},
        },
      });

      const normalizedData = data.map((cottage) => ({
        ...cottage,
        cottageServices: cottage.cottageServices.map((cs) => ({
          ...cs.service,
        })),
        images: cottage.images.map((img) => ({
          ...img,
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
  ): Promise<{ success?: CottageDetailType; error?: string }> => {
    try {
      const data = await db.query.cottages.findFirst({
        with: {
          cottageServices: {
            with: {
              service: { columns: { id: true, name: true, icon: true } },
            },
          },
          images: {},
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
        images: data.images.map((img) => ({
          ...img,
        })),
      };

      return { success: normalizedData };
    } catch (error) {
      return { error: "Couldn't find the specified cottage." };
    }
  },
);

export const getMyCottages = cache(
  async (
    userId: string,
  ): Promise<{ success?: CottageDetailType[]; error?: string }> => {
    try {
      const data = await db.query.cottages.findMany({
        with: {
          cottageServices: {
            columns: { serviceId: false },
            with: {
              service: { columns: { id: true, name: true, icon: true } },
            },
          },
          images: {},
        },
        where: (table, funcs) => funcs.eq(table.userId, userId),
      });

      const normalizedData = data.map((cottage) => ({
        ...cottage,
        cottageServices: cottage.cottageServices.map((cs) => ({
          ...cs.service,
        })),
        images: cottage.images.map((img) => ({
          ...img,
        })),
      }));

      return { success: normalizedData };
    } catch (err) {
      return { error: "Couldn't find any cottages." };
    }
  },
);

export const getCottageReservedRanges = cache(
  async (
    cottageId: number,
  ): Promise<{
    success?: ReservedRangeType[];
    error?: string;
  }> => {
    try {
      const data = await db.query.reservations.findMany({
        columns: { from: true, to: true },
        where: (table, funcs) =>
          funcs.and(
            funcs.eq(table.cottageId, cottageId),
            funcs.or(
              funcs.eq(table.status, 'pending'),
              funcs.eq(table.status, 'confirmed'),
            ),
          ),
      });

      return { success: data };
    } catch (err) {
      return { error: "Couldn't find reservation ranges." };
    }
  },
);

export const getOwnerReservations = cache(
  async (
    userId: string,
  ): Promise<{ success?: ReservationType[]; error?: string }> => {
    try {
      const ownedCottages = await db.query.cottages.findMany({
        columns: { id: true },
        where: (table, funcs) => funcs.eq(table.userId, userId),
      });

      const cottageIds = ownedCottages.map((cottage) => cottage.id);

      if (cottageIds.length === 0) {
        return { success: [] };
      }

      // Fetch all reservations for the owned cottages
      const data = await db.query.reservations.findMany({
        where: (table, funcs) => funcs.inArray(table.cottageId, cottageIds),
      });

      return { success: data };
    } catch (err) {
      return { error: "Couldn't find any reservations." };
    }
  },
);

export const getHikerReservations = cache(
  async (
    userId: string,
  ): Promise<{ success?: ReservationType[]; error?: string }> => {
    try {
      const data = await db.query.reservations.findMany({
        with: {
          cottage: {
            columns: { id: true, name: true },
          },
        },
        where: (table, funcs) => funcs.eq(table.userId, userId),
      });

      return { success: data };
    } catch (err) {
      return { error: "Couldn't find any reservations." };
    }
  },
);
