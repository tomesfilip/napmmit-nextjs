'use server';

import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { CreateCottageSchemaType } from '@/lib/formSchemas';
import db from '@/server/db/drizzle';
import {
  cottages,
  cottageServices,
  images,
  services,
} from '@/server/db/schema';
import { inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function createCottage(
  data: Partial<CreateCottageSchemaType> & {
    title: string;
    description: string;
  },
) {
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

    const cottage = await db
      .insert(cottages)
      .values({
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
      })
      .returning({ id: cottages.id });

    if (!cottage?.[0]?.id) throw new Error('Failed to create cottage');
    const cottageId = cottage[0].id;

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

    // TODO: Handle image uploads to cloud storage and save URLs
    // if (data.imageFiles?.length) {
    //   await db.insert(images).values(
    //     data.imageFiles.map((img, index) => ({
    //       cottageId,
    //       src: `uploaded-url-${img.id}`,
    //       width: 800,
    //       height: 600,
    //     }))
    //   );
    // }

    return cottageId;
  } catch (error) {
    console.error('Cottage creation failed:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to create cottage');
  }
}
