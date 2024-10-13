import Link from 'next/link';

export const NavHeader = () => {
  return (
    <header className="flex w-full max-w-[1600px] justify-between border-b-[1px] px-4 py-3">
      <Link href="/" className="w-max text-xl font-bold uppercase">
        Napmmit
      </Link>
      <nav className="flex w-full justify-end">
        <ul>
          <li>
            <Link
              href="/login"
              className="rounded-lg bg-slate-100 px-4 py-2 text-lg font-semibold"
            >
              Prihlásiť sa
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
