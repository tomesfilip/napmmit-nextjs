import { Cottage, Service } from '@/server/db/schema';

export type CottageWithServices = Cottage & {
  cottageServices: Service[];
};
