import type * as Icons from '@/components/icons/index';
import { Cottage, ImageType, Service, userRoleEnum } from '@/server/db/schema';

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export type CottageDetailType = Cottage & {
  cottageServices: Service[];
  images: ImageType[];
};

export type CottageArea = {
  name: string;
  group?: string;
};

export type IconType = keyof typeof Icons;

export type CookieConsentType = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ReservationStatusType = 'pending' | 'confirmed' | 'cancelled';
