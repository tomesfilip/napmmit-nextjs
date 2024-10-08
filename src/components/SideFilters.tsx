'use client';

import { SERVICES } from '@/lib/constants';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Props {
  availableMountainAreas: string[];
}

export const SideFiltersContent = ({ availableMountainAreas }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filterServices = useMemo(() => {
    return searchParams.get('service')?.split('-') || [];
  }, [searchParams]);

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

    if (!availableMountainAreas.some((name) => name === area)) {
      params.delete('location');
    } else {
      params.set('location', area);
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="space-y-8 h-full">
      <div className="space-y-4 mb-4">
        <h2 className="font-bold text-lg">Oblasť</h2>
        <Select onValueChange={handleSelectCottageArea}>
          <SelectTrigger className="w-[276px]">
            <SelectValue placeholder="Vysoké Tatry, Malá Fatra, ..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Všetky</SelectItem>
              {availableMountainAreas.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
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
                'cursor-pointer text-base transition-colors bg-slate-100 hover:bg-slate-400 hover:text-white duration-300 ease-in-out',
                {
                  'bg-slate-400 text-white': filterServices.includes(name),
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
  );
};
