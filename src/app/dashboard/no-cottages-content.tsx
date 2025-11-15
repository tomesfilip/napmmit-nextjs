import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const NoCottagesContent = () => {
  const t = useTranslations('Dashboard');

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        {t('NoCottages.Title')}
      </h2>
      <p className="mb-8 max-w-md text-gray-600">
        {t('NoCottages.Description')}
      </p>
      <Link
        href="/dashboard/create"
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
      >
        {t('NoCottages.CreateButton')}
      </Link>
    </div>
  );
};
