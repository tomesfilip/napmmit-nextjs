'use client';

import cottageFallbackImg from '@/assets/img/cottage-fallback.webp';
import { CottageDetailType } from '@/lib/appTypes';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '../shared/icon';
import { ServiceBadge } from '../shared/service-badge';
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { DashboardControls } from './dashboard-controls';

type Props = {
  cottage: CottageDetailType;
  isEditable?: boolean;
};

export const CottageCard = ({ cottage, isEditable }: Props) => {
  return (
    <Card className="group relative aspect-[16/9] h-fit min-h-[260px] w-full cursor-pointer overflow-hidden xl:min-h-[280px] 2xl:min-h-[260px]">
      <Link
        href={`${ROUTES.COTTAGE_DETAIL}/${cottage.id}`}
        className="absolute left-0 top-0 size-full"
      />
      <Image
        src={cottageFallbackImg}
        alt={`image ${cottage.name}`}
        placeholder="blur"
        className="pointer-events-none absolute left-0 top-0 size-full rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
        width={926}
        height={520}
      />
      <div className="pointer-events-none relative size-full rounded-md p-2">
        <CardHeader className="relative space-y-3 p-0">
          <div className="flex w-full justify-between gap-4">
            <div className="glass-bg flex h-max max-w-max items-center gap-2 bg-black/30 px-3 py-1 text-white">
              <Icon icon="Location" className="size-4 fill-white" />
              <p className="font-medium">{cottage.mountainArea}</p>
            </div>
            {isEditable && <DashboardControls cottageId={cottage.id} />}
          </div>
          <div className="flex gap-2">
            {cottage.cottageServices.map((service) => (
              <ServiceBadge key={service.id} serviceBadge={service} />
            ))}
          </div>
        </CardHeader>
        <CardFooter className="absolute bottom-2 left-0 flex w-full items-end justify-between gap-8 p-0 px-2">
          <CardTitle className="glass-bg relative bg-black/30 px-3 py-1 text-lg leading-8 text-white lg:line-clamp-1 lg:text-xl">
            {cottage.name}
          </CardTitle>
        </CardFooter>
      </div>
    </Card>
  );
};
