import cottageFallbackImg from '@/assets/img/cottage-fallback.webp';
import { CottageDetailType } from '@/lib/appTypes';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ServiceBadge } from './shared/service-badge';
import { Icon } from './shared/icon';

type Props = {
  cottage: CottageDetailType;
};

export const CottageCard = ({ cottage }: Props) => {
  return (
    <Card className="group relative aspect-[16/9] h-fit w-full overflow-hidden xl:min-h-[280px] 2xl:min-h-[260px]">
      <Image
        src={cottageFallbackImg}
        alt={`image ${cottage.name}`}
        placeholder="blur"
        className="absolute left-0 top-0 z-0 size-full rounded-lg object-cover"
        width={926}
        height={520}
      />
      <div className="relative z-[1] size-full rounded-md p-2">
        <CardHeader className="space-y-3 p-0">
          <div className="glass-bg flex max-w-max items-center gap-2 bg-black/30 px-3 py-1 text-white">
            <Icon icon="Location" className="size-4 fill-white" />
            <p className="font-medium">{cottage.mountainArea}</p>
          </div>

          <div className="flex gap-2">
            {cottage.cottageServices.map(({ id, name, icon }) => (
              <ServiceBadge
                key={id}
                serviceBadge={{ name, icon }}
                aria-label={name}
              />
            ))}
          </div>
        </CardHeader>
        <CardFooter className="absolute bottom-2 left-0 flex w-full items-end justify-between gap-8 p-0 px-2">
          <CardTitle className="glass-bg relative z-[1] bg-black/30 px-3 py-1 text-lg leading-8 text-white lg:line-clamp-1 lg:text-xl">
            {cottage.name}
          </CardTitle>
          <Link
            className="ml-auto flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 font-medium transition-all hover:px-4"
            href={`/cottage/${cottage.id}`}
          >
            Viac
            <Icon icon="ArrowRight" className="size-4 fill-black" />
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};
