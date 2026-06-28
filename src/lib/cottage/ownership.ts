import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';
import type { CottageDetailType } from '@/lib/appTypes';
import db from '@/server/db/drizzle';
import { cottages, type ImageType, type Service } from '@/server/db/schema';

export function cottageOwnershipFilter(cottageId: number, user: User) {
  if (user.role === 'admin') {
    return eq(cottages.id, cottageId);
  }

  return and(eq(cottages.id, cottageId), eq(cottages.userId, user.id));
}

type CottageWithRelations = Omit<
  CottageDetailType,
  'cottageServices' | 'images'
> & {
  cottageServices: Array<{ service: Pick<Service, 'id' | 'name' | 'icon'> }>;
  images: ImageType[];
};

function normalizeCottageDetail(data: CottageWithRelations): CottageDetailType {
  return {
    ...data,
    cottageServices: data.cottageServices.map((cs) => ({
      ...cs.service,
    })),
    images: data.images.map((img) => ({
      ...img,
    })),
  };
}

export async function getCottageIfOwned(
  cottageId: number,
  user: User,
): Promise<CottageDetailType | null> {
  const data = await db.query.cottages.findFirst({
    with: {
      cottageServices: {
        with: {
          service: { columns: { id: true, name: true, icon: true } },
        },
      },
      images: {},
    },
    where: cottageOwnershipFilter(cottageId, user),
  });

  if (!data) {
    return null;
  }

  return normalizeCottageDetail(data as CottageWithRelations);
}
