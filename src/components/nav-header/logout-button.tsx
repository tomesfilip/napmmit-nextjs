import { logout } from '@/lib/auth/actions';
import { useTranslations } from 'next-intl';

export const LogoutButton = () => {
  const t = useTranslations('NavHeader');

  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-lg bg-slate-100 px-4 py-2 font-semibold transition-colors duration-200 ease-in-out hover:bg-slate-200 lg:text-lg"
      >
        {t('Logout')}
      </button>
    </form>
  );
};
