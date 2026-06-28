'use server';

import { eq, inArray } from 'drizzle-orm';
import type { User } from 'lucia';
import { validateRequest } from '@/lib/auth/validateRequest';
import { cottageOwnershipFilter } from '@/lib/cottage/ownership';
import type { CreateCottageSchemaType } from '@/lib/formSchemas';
import db from '@/server/db/drizzle';
import {
  cottageServices,
  cottages,
  images,
  reservations,
  services,
} from '@/server/db/schema';
import type { CottageDetailType } from '../appTypes';

type ImageInput = {
  src: string;
  width: number;
  height: number;
  order: number;
};

type CreateUpdateDataType = Partial<CreateCottageSchemaType> & {
  cottageId?: number;
  title: string;
  description: string;
  images?: ImageInput[];
};

async function requireAuthenticatedUser(): Promise<User> {
  const { user } = await validateRequest();
  if (!user) throw new Error('Unauthorized');
  return user;
}

async function prepareCottageData(data: CreateUpdateDataType) {
  const { user } = await validateRequest();
  if (!user) throw new Error('Unauthorized');

  // Validate required fields
  if (!data.title?.trim()) throw new Error('Title is required');
  if (!data.description?.trim()) throw new Error('Description is required');
  if (!data.address?.trim()) throw new Error('Address is required');
  if (!data.mountainArea?.trim()) throw new Error('Mountain area is required');
  if (!data.totalBeds || data.totalBeds < 1)
    throw new Error('Valid occupancy is required');

  return {
    name: data.title,
    description: data.description,
    address: data.address || '',
    mountainArea: data.mountainArea || '',
    totalBeds: data.totalBeds || 1,
    pricePerNight: Math.round(data.pricePerNight || 0),
    priceLowPerNight: data.lowPricePerNight
      ? Math.round(Number(data.lowPricePerNight))
      : null,
    priceBreakfast: data.breakfastPrice
      ? Math.round(Number(data.breakfastPrice))
      : null,
    priceDinner: data.dinnerPrice ? Math.round(Number(data.dinnerPrice)) : null,
    phoneNumber: data.phone || null,
    email: data.email || null,
    website: data.website || null,
    userId: user.id,
    locationURL: data.locationUrl || null,
    unAvailabilityDates: data.unavailableDates || [],
  };
}

export async function updateCottage(data: CreateUpdateDataType) {
  if (!data.cottageId) {
    throw new Error('Cottage ID is required');
  }

  const user = await requireAuthenticatedUser();
  const cottageData = await prepareCottageData(data);
  const cottageId = data.cottageId;
  const { userId: _userId, ...updateFields } = cottageData;

  const [updatedCottage] = await db
    .update(cottages)
    .set(updateFields)
    .where(cottageOwnershipFilter(cottageId, user))
    .returning({ id: cottages.id });
  if (!updatedCottage?.id) throw new Error('Unauthorized');

  if (data.services) {
    await db
      .delete(cottageServices)
      .where(eq(cottageServices.cottageId, cottageId));

    if (data.services.length) {
      const serviceIds = await db
        .select({ id: services.id })
        .from(services)
        .where(inArray(services.id, data.services));

      if (serviceIds.length) {
        await db.insert(cottageServices).values(
          serviceIds.map((service) => ({
            cottageId,
            serviceId: service.id,
          })),
        );
      }
    }
  }

  if (data.images?.length) {
    await db.delete(images).where(eq(images.cottageId, cottageId));

    await db.insert(images).values(
      data.images.map(({ src, width, height, order }) => ({
        cottageId,
        src,
        width,
        height,
        order,
      })),
    );
  }

  return cottageId;
}

export async function createCottage(data: CreateUpdateDataType) {
  const cottageData = await prepareCottageData(data);

  try {
    const [newCottage] = await db
      .insert(cottages)
      .values(cottageData)
      .returning({ id: cottages.id });

    if (!newCottage?.id) throw new Error('Failed to create cottage');
    const cottageId = newCottage.id;

    if (data.services?.length) {
      const serviceIds = await db
        .select({ id: services.id })
        .from(services)
        .where(inArray(services.id, data.services));

      if (serviceIds.length) {
        await db.insert(cottageServices).values(
          serviceIds.map((service) => ({
            cottageId,
            serviceId: service.id,
          })),
        );
      }
    }

    if (data.images?.length) {
      await db.insert(images).values(
        data.images.map(({ src, width, height, order }) => ({
          cottageId,
          src,
          width,
          height,
          order,
        })),
      );
    }

    return cottageId;
  } catch (error) {
    console.error('Cottage creation failed:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to create cottage');
  }
}

export async function deleteCottage(cottageId: CottageDetailType['id']) {
  try {
    const user = await requireAuthenticatedUser();

    const [cottage] = await db
      .select({ id: cottages.id })
      .from(cottages)
      .where(cottageOwnershipFilter(cottageId, user))
      .limit(1);

    if (!cottage) {
      throw new Error('Unauthorized');
    }

    const responseServices = await db
      .delete(cottageServices)
      .where(eq(cottageServices.cottageId, cottageId));

    console.log('Delete cottage services response:', responseServices);

    const responseImages = await db
      .delete(images)
      .where(eq(images.cottageId, cottageId));
    console.log('Delete cottage images response:', responseImages);

    const reservationsResponse = await db
      .delete(reservations)
      .where(eq(reservations.cottageId, cottageId));
    console.log('Delete cottage reservations response:', reservationsResponse);

    const response = await db
      .delete(cottages)
      .where(eq(cottages.id, cottageId));
    console.log('Delete cottage response:', response);

    return { success: true };
  } catch (error) {
    console.error('Cottage deletion failed:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to delete cottage');
  }
}
