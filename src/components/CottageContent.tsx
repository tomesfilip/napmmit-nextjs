'use client';

import { CottageWithServices } from '@/lib/appTypes';
import { COTTAGE_AREAS, SERVICES } from '@/lib/constants';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { CottageCard } from './cottageCard';
import { Badge } from './ui/badge';
import { Search } from './ui/search';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type Props = {
  cottages: CottageWithServices[];
};

export const CottageContent = ({ cottages }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filterServices = useMemo(() => {
    return searchParams.get('service')?.split('-') || [];
  }, [searchParams]);

  const filterLocation = searchParams.get('location');
  const searchQuery = searchParams.get('query');

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
        (cottage) => !filterLocation || cottage.location === filterLocation,
      )
      .filter(
        (cottage) =>
          !searchQuery ||
          cottage.location.includes(searchQuery) ||
          cottage.name.includes(searchQuery),
      );
  }, [cottages, filterServices, filterLocation, searchQuery]);

  const handleSelectService = useCallback(
    (service: string) => {
      if (!SERVICES.some(({ name }) => name === service)) return;

      const currentServices = new Set(filterServices);
      if (currentServices.has(service)) {
        currentServices.delete(service);
      } else {
        currentServices.add(service);
      }

      const updatedServices = Array.from(currentServices).join('-');
      const params = new URLSearchParams(searchParams);

      if (updatedServices) {
        params.set('service', updatedServices);
      } else {
        params.delete('service');
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [filterServices, pathname, replace, searchParams],
  );

  const handleSelectCottageArea = (area: string) => {
    const params = new URLSearchParams(searchParams);

    if (!COTTAGE_AREAS.some(({ name }) => name === area)) {
      params.delete('location');
    } else {
      params.set('location', area);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="px-8 py-12 bg-white">
        <div className="space-y-8">
          <Search placeholder="Vysoké Tatry, Bílkova Chata, ..." />
          <div className="space-y-4 mb-4">
            <h2 className="font-bold text-lg">Oblasť</h2>
            <Select onValueChange={handleSelectCottageArea}>
              <SelectTrigger className="w-[276px]">
                <SelectValue placeholder="Vysoké Tatry, Malá Fatra, ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Všetky</SelectItem>
                  {COTTAGE_AREAS.map(({ name, group }) => (
                    <SelectItem key={name} value={name}>
                      {name} {group && ` (${group})`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Extra služby</h2>
            <div className="flex gap-3">
              {SERVICES.map(({ name }) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className={clsx(
                    'cursor-pointer text-base transition-colors bg-slate-100 hover:bg-slate-400 duration-300 ease-in-out',
                    {
                      'bg-slate-400 hover:bg-slate-100':
                        filterServices.includes(name),
                    },
                  )}
                  onClick={() => handleSelectService(name)}
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      {filteredCottages.length > 0 && (
        <div className="flex flex-wrap gap-8 py-8 px-4 w-full">
          {filteredCottages.map((cottage) => (
            <CottageCard key={cottage.id} cottage={cottage} />
          ))}
        </div>
      )}
    </>
  );
};
