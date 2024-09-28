'use client';

import { CottageWithServices } from '@/lib/appTypes';
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
  cottages: CottageWithServices[];
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
      <div className="space-y-4 w-full">
        <div className="flex gap-4 items-center w-full justify-center lg:justify-start">
          <Search placeholder="Vysoké Tatry, Bílkova Chata, ..." />
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger
                className="bg-slate-200 size-10 flex items-center justify-center rounded-full"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 py-8 w-full place-items-center lg:place-items-start">
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
