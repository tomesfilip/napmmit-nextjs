'use server';

import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { CreateCottageSchemaType } from '@/lib/formSchemas';
import db from '@/server/db/drizzle';
import {
  cottages,
  cottageServices,
  images,
  reservations,
  services,
} from '@/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { CottageDetailType } from '../appTypes';

type createUpdateDataType = Partial<CreateCottageSchemaType> & {
  cottageId?: number;
  title: string;
  description: string;
  images?: string[];
};

async function prepareCottageData(data: createUpdateDataType) {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error('Unauthorized');

    // Validate required fields
    if (!data.title?.trim()) throw new Error('Title is required');
    if (!data.description?.trim()) throw new Error('Description is required');
    if (!data.address?.trim()) throw new Error('Address is required');
    if (!data.mountainArea?.trim())
      throw new Error('Mountain area is required');
    if (!data.occupancy || data.occupancy < 1)
      throw new Error('Valid occupancy is required');

    const cottageData = {
      name: data.title,
      description: data.description,
      address: data.address || '',
      mountainArea: data.mountainArea || '',
      capacity: data.occupancy || 1,
      availableBeds: data.occupancy || 1,
      pricePerNight: Math.round(data.pricePerNight || 0),
      priceLowPerNight: data.lowPricePerNight
        ? Math.round(Number(data.lowPricePerNight))
        : null,
      priceBreakfast: data.breakfastPrice
        ? Math.round(Number(data.breakfastPrice))
        : null,
      priceDinner: data.dinnerPrice
        ? Math.round(Number(data.dinnerPrice))
        : null,
      phoneNumber: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      userId: user.id,
      locationURL: data.locationUrl || null,
    };

    return cottageData;
  } catch (error) {
    console.error('Cottage preparation failed:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to prepare cottage data');
  }
}

export async function updateCottage(data: createUpdateDataType) {
  const cottageData = await prepareCottageData(data);

  try {
    const cottageId = data.cottageId;
    if (!cottageId) throw new Error('Cottage ID is required');

    const updatedCottage = await db
      .update(cottages)
      .set(cottageData)
      .where(eq(cottages.id, cottageId))
      .returning({ id: cottages.id });

    if (!updatedCottage?.[0]?.id) throw new Error('Failed to update cottage');
    const updatedCottageId = updatedCottage[0].id;
    // If new image URLs were provided, insert them for this cottage
    if (data.images?.length) {
      await db.insert(images).values(
        data.images.map((src) => ({
          cottageId: updatedCottageId,
          src,
          width: 800,
          height: 600,
        })),
      );
    }
    redirect(`${ROUTES.COTTAGE_DETAIL}/${updatedCottageId}`);
  } catch (error) {
    console.error('Cottage update failed:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to update cottage');
  }
}

export async function createCottage(data: createUpdateDataType) {
  const cottageData = await prepareCottageData(data);

  try {
    const newCottage = await db
      .insert(cottages)
      .values(cottageData)
      .returning({ id: cottages.id });

    if (!newCottage?.[0]?.id) throw new Error('Failed to create cottage');
    const cottageId = newCottage[0].id;

    if (data.services?.length) {
      const serviceIds = await db
        .select({ id: services.id })
        .from(services)
        .where(inArray(services.name, data.services));

      if (serviceIds.length) {
        await db.insert(cottageServices).values(
          serviceIds.map((service) => ({
            cottageId,
            serviceId: service.id,
          })),
        );
      }
    }

    // Save uploaded image URLs (we expect `data.images` to be an array of URLs)
    if (data.images?.length) {
      await db.insert(images).values(
        data.images.map((src) => ({
          cottageId,
          src,
          width: 800,
          height: 600,
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
