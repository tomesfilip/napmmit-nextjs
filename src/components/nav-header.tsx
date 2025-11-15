import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const NavHeader = () => {
  const t = useTranslations('NavHeader');

  return (
    <header className="flex w-full max-w-[1600px] justify-between border-b-[1px] px-4 py-3 lg:px-12">
      <Link href="/" className="w-max font-alatsi text-xl uppercase">
        Napmmit
      </Link>
      <nav className="flex w-full justify-end">
        <ul>
          <li>
            <Link
              href="/login"
              className="rounded-lg bg-slate-100 px-4 py-2 font-semibold lg:text-lg"
            >
              {t('Login')}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
