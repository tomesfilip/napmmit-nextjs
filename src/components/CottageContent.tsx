'use client';

import { CottageDetailType } from '@/lib/appTypes';
import { lowerCaseNoDiacriticsText } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { CottageCard } from './cottageCard';
import { NoCottageFoundContent } from './NoCottageFoundContent';
import { SideFiltersContent } from './SideFilters';
import { Search } from './ui/search';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

type Props = {
  cottages: CottageDetailType[];
};

export const CottageContent = ({ cottages }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const filterLocation = searchParams.get('location');
  const searchQuery = searchParams.get('query');

  const availableMountainAreas = useMemo(() => {
    return Array.from(
      new Set(cottages.map(({ mountainArea }) => mountainArea)),
    );
  }, [cottages]);

  const filterServices = useMemo(() => {
    return searchParams.get('service')?.split('-') || [];
  }, [searchParams]);

  const filteredCottages = useMemo(() => {
    if (!filterLocation && !filterServices && !searchQuery) {
      return cottages;
    }
    return cottages
      .filter((cottage) =>
        filterServices.every((service) =>
          cottage.cottageServices.some(
            (cottageService) => cottageService.name === service,
          ),
        ),
      )
      .filter(
        (cottage) =>
          !filterLocation ||
          lowerCaseNoDiacriticsText(cottage.mountainArea) ===
            lowerCaseNoDiacriticsText(filterLocation),
      )
      .filter(
        (cottage) =>
          !searchQuery ||
          lowerCaseNoDiacriticsText(cottage.mountainArea).includes(
            searchQuery,
          ) ||
          lowerCaseNoDiacriticsText(cottage.name).includes(searchQuery),
      );
  }, [cottages, filterServices, filterLocation, searchQuery]);

  const handleResetFilters = () => {
    replace('/');
  };

  return (
    <>
      <div className="hidden lg:block">
        <SideFiltersContent availableMountainAreas={availableMountainAreas} />
      </div>
      <div className="w-full space-y-4">
        <div className="sticky top-0 z-10 flex w-full items-center justify-center gap-4 bg-white bg-opacity-75 py-4 backdrop-blur-sm transition-all md:p-0 lg:relative lg:justify-start lg:bg-none lg:backdrop-blur-none">
          <Search placeholder="Vysoké Tatry, Bílkova Chata, ..." />
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger
                className="flex size-10 items-center justify-center rounded-full bg-slate-100"
                aria-label="Open filters"
              >
                <FaFilter size={20} />
              </SheetTrigger>
              <SheetContent side="left" className="py-12">
                <SideFiltersContent
                  availableMountainAreas={availableMountainAreas}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {filteredCottages.length > 0 && (
          <div className="grid w-full grid-cols-1 place-items-center gap-8 py-8 lg:grid-cols-2 lg:place-items-start 2xl:grid-cols-3">
            {filteredCottages.map((cottage) => (
              <CottageCard key={cottage.id} cottage={cottage} />
            ))}
          </div>
        )}
        {filteredCottages.length < 1 && (
          <NoCottageFoundContent handleResetFilters={handleResetFilters} />
        )}
      </div>
    </>
  );
};
