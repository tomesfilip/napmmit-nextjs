import { Cottage, Image, Service } from '@/server/db/schema';

export type CottageDetailType = Cottage & {
  cottageServices: Service[];
  images: Pick<Image, 'id' | 'url'>[];
};

export type CottageArea = {
  name: string;
  group?: string;
};
