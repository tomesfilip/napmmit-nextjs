import type * as Icons from '@/components/icons/index';
import { Cottage, ImageType, Service } from '@/server/db/schema';

export type CottageDetailType = Cottage & {
  cottageServices: Service[];
  images: ImageType[];
};

export type CottageArea = {
  name: string;
  group?: string;
};

export type ServiceBadgeType = {
  name: string;
  icon: keyof typeof Icons;
};

export type IconType = keyof typeof Icons;

export type CookieConsentType = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};
