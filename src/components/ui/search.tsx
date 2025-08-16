'use client';

import { lowerCaseNoDiacriticsText } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LuSearch } from 'react-icons/lu';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  placeholder: string;
};

export const Search = ({ placeholder }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', lowerCaseNoDiacriticsText(term));
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex w-full rounded-md focus:shadow-md lg:max-w-[400px]">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-3 pl-10 pr-4 text-sm transition-all duration-200 placeholder:text-gray-500 hover:shadow-md focus:shadow-md"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <LuSearch className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
};
