import { logout } from '@/lib/auth/actions';
import { validateRequest } from '@/lib/auth/validateRequest';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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
              <li className="text-sm font-medium text-gray-700">
                {user.email}
              </li>
              <li>
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-100 px-4 py-2 font-semibold lg:text-lg"
                  >
                    {t('Logout')}
                  </button>
                </form>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold lg:text-lg"
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
