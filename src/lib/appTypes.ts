import type * as Icons from '@/components/icons/index';
import type {
  Cottage,
  ImageType,
  ReservationType,
  Service,
  userRoleEnum,
} from '@/server/db/schema';

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

export type OwnerReservationType = ReservationType & {
  cottage: Pick<Cottage, 'id' | 'name'> & {
    images: ImageType[];
  };
};

export type HikerReservationType = ReservationType & {
  cottage: Pick<Cottage, 'id' | 'name'> & {
    images: ImageType[];
  };
};
