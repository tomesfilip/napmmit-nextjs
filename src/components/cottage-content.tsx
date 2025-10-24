'use client';

import { CottageDetailType } from '@/lib/appTypes';
import { lowerCaseNoDiacriticsText } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { CottageCard } from './cottage-card';
import { NoCottageFoundContent } from './no-cottage-found-content';
import { Icon } from './shared/icon';
import { SideFiltersContent } from './side-filters';
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
      <div className="hidden xl:block">
        <SideFiltersContent availableMountainAreas={availableMountainAreas} />
      </div>
      <div className="w-full space-y-4">
        <div className="sticky top-0 z-10 flex w-full items-center justify-center gap-4 bg-white bg-opacity-75 py-4 backdrop-blur-sm transition-all xl:relative xl:justify-start xl:bg-none xl:p-0 xl:backdrop-blur-none">
          <Search placeholder="Vysoké Tatry, Bílkova Chata, ..." />
          <div className="block xl:hidden">
            <Sheet>
              <SheetTrigger
                className="flex size-10 items-center justify-center rounded-full bg-slate-100"
                aria-label="Open filters"
              >
                <Icon icon="Filter" className="size-5 fill-black" />
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
          <div className="grid w-full grid-cols-1 place-items-center gap-8 pb-6 md:grid-cols-2 md:place-items-start lg:py-8 2xl:grid-cols-3">
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
