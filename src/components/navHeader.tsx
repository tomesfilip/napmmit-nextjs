import Link from 'next/link';

export const NavHeader = () => {
  return (
    <header className="border-b-[1px] py-3 flex justify-between w-full px-4 max-w-[1600px]">
      <Link href="/" className="text-xl font-bold uppercase w-max">
        Napmmit
      </Link>
      <nav className="w-full flex justify-end">
        <ul>
          <li>
            <Link
              href="/login"
              className="bg-slate-100 px-4 py-2 rounded-lg font-semibold text-lg"
            >
              Prihlásiť sa
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
