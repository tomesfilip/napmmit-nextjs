'use client';

import cottageFallbackImg from '@/assets/img/cottage-fallback.webp';
import { CottageDetailType } from '@/lib/appTypes';
import { ROUTES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from './shared/icon';
import { ServiceBadge } from './shared/service-badge';
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card';

type Props = {
  cottage: CottageDetailType;
  isEditable?: boolean;
};

export const CottageCard = ({ cottage, isEditable }: Props) => {
  const t = useTranslations('Home');
  const tDashboard = useTranslations('Dashboard');

  const router = useRouter();

  return (
    <Card
      className="group relative aspect-[16/9] h-fit min-h-[260px] w-full cursor-pointer overflow-hidden xl:min-h-[280px] 2xl:min-h-[260px]"
      onClick={() => router.push(`${ROUTES.COTTAGE_DETAIL}/${cottage.id}`)}
    >
      <Image
        src={cottageFallbackImg}
        alt={`image ${cottage.name}`}
        placeholder="blur"
        className="absolute left-0 top-0 z-0 size-full rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
        width={926}
        height={520}
      />
      <div className="relative z-[1] size-full rounded-md p-2">
        <CardHeader className="space-y-3 p-0">
          <div className="flex w-full justify-between gap-4">
            <div className="glass-bg flex max-w-max items-center gap-2 bg-black/30 px-3 py-1 text-white">
              <Icon icon="Location" className="size-4 fill-white" />
              <p className="font-medium">{cottage.mountainArea}</p>
            </div>
            {isEditable && (
              <Link
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 font-medium transition-all hover:px-4"
                href={`${ROUTES.EDIT_COTTAGE}/${cottage.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                {tDashboard('CottageList.UpdateCottageLink')}
                <Icon icon="Edit" className="size-4 fill-black" />
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            {cottage.cottageServices.map(({ id, name, icon }) => (
              <ServiceBadge key={id} serviceBadge={{ name, icon }} />
            ))}
          </div>
        </CardHeader>
        <CardFooter className="absolute bottom-2 left-0 flex w-full items-end justify-between gap-8 p-0 px-2">
          <CardTitle className="glass-bg relative z-[1] bg-black/30 px-3 py-1 text-lg leading-8 text-white lg:line-clamp-1 lg:text-xl">
            {cottage.name}
          </CardTitle>
        </CardFooter>
      </div>
    </Card>
  );
};
