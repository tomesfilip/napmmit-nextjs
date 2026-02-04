import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LogoutButton } from './logout-button';

export const NavHeader = async () => {
  const t = useTranslations('NavHeader');
  const { user } = await validateRequest();

  return (
    <header className="flex w-full max-w-[1600px] items-center justify-between border-b-[1px] px-4 py-3 lg:px-12">
      <Link href="/" className="w-max font-alatsi text-xl uppercase">
        Napmmit
      </Link>
      <nav className="flex w-full justify-end">
        <ul className="flex items-center gap-4">
          {user ? (
            <>
              <li className="text-sm font-medium">
                <Link
                  href={ROUTES.DASHBOARD.RESERVATIONS}
                  className="border-b border-b-transparent transition-all duration-200 hover:border-b-black"
                >
                  {t('Reservations')}
                </Link>
              </li>
              {user.role !== 'hiker' && (
                <li className="text-sm font-medium">
                  <Link
                    href={ROUTES.DASHBOARD.INDEX}
                    className="border-b border-b-transparent transition-all duration-200 hover:border-b-black"
                  >
                    {t('Dashboard')}
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold transition-colors duration-200 ease-in-out hover:bg-slate-200 lg:text-lg"
              >
                {t('Login')}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
