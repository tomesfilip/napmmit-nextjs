import Image from 'next/image';

import img404 from '@/assets/img/404.jpg';
import { HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <div className="relative xl:py-10">
      <Image
        width={0}
        height={0}
        src={img404}
        alt="404"
        priority
        className="aspect-video h-[632px] w-full max-w-[1600px] object-cover"
      />
      <div className="absolute left-0 top-4 z-[2] max-w-[766px] space-y-3 px-4 text-white xl:left-12 xl:top-20">
        <h1 className="text-4xl font-extrabold lg:text-5xl">{t('Title')}</h1>
        <h2 className="text-xl font-medium">{t('Subtitle')}</h2>
        <h3>{t('ErrorCode')}</h3>
      </div>
      <Link
        href="/"
        className="absolute bottom-20 left-1/2 z-[2] flex w-max -translate-x-1/2 items-center gap-4 rounded-lg bg-white px-5 py-4 text-xl font-bold transition-colors hover:bg-gray-200 xl:text-3xl"
      >
        <HomeIcon className="flex-shrink-0" />
        {t('ReturnHomeButton')}
      </Link>
    </div>
  );
}
