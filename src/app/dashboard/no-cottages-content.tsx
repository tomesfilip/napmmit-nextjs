import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ROUTES } from '@/lib/constants';

type Props = {
  canCreateCottage: boolean;
};

export async function NoCottagesContent({ canCreateCottage }: Props) {
  const t = await getTranslations('Dashboard');

  if (!canCreateCottage) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          {t('NoCottages.HikerTitle')}
        </h2>
        <p className="mb-8 max-w-md text-gray-600">
          {t('NoCottages.HikerDescription')}
        </p>
        <Link
          href={ROUTES.DASHBOARD.RESERVATIONS}
          className="rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
        >
          {t('NoCottages.ViewReservationsLink')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        {t('NoCottages.Title')}
      </h2>
      <p className="mb-8 max-w-md text-gray-600">
        {t('NoCottages.Description')}
      </p>
      <Link
        href={`${ROUTES.CREATE_COTTAGE.INDEX}/${ROUTES.CREATE_COTTAGE.STEP_ONE}`}
        className="rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
      >
        {t('NoCottages.CreateButton')}
      </Link>
    </div>
  );
}
