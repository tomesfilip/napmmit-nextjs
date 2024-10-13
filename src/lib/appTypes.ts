import { Cottage, ImageType, Service } from '@/server/db/schema';

export type CottageDetailType = Cottage & {
  cottageServices: Service[];
  images: ImageType[];
};

export type CottageArea = {
  name: string;
  group?: string;
};
