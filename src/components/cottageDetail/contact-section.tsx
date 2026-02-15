import { CottageDetailType } from '@/lib/appTypes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Icon } from '../shared/icon';

export const ContactSection = ({
  phoneNumber,
  email,
  website,
}: CottageDetailType) => {
  const t = useTranslations('CottageDetail');

  return (
    <section className="w-full space-y-4 px-4 xl:col-span-7 2xl:col-span-8">
      <hr />
      <h2 className="text-lg font-medium lg:text-xl">{t('ContactTitle')}</h2>
      <div className="flex w-full flex-wrap gap-6 lg:grid-cols-3 lg:gap-12">
        {phoneNumber && (
          <div className="flex items-center gap-2">
            <Icon icon="Phone" className="size-6 flex-shrink-0 fill-black" />
            <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Icon icon="Mail" className="size-7 flex-shrink-0 fill-black" />
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-2">
            <Icon icon="Link" className="size-6 flex-shrink-0 fill-black" />
            <Link
              className="max-w-[230px] overflow-hidden overflow-ellipsis lg:max-w-[360px]"
              target="_blank"
              href={website}
            >
              {website}
            </Link>
          </div>
        )}
      </div>
      <hr />
    </section>
  );
};
