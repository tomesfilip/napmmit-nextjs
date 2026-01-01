'use client';

import { SERVICES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ServiceBadge } from './shared/service-badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Props {
  availableMountainAreas: string[];
}

export const SideFiltersContent = ({ availableMountainAreas }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const t = useTranslations('Home');

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
    <div className="h-full space-y-8">
      <div className="mb-4 space-y-4">
        <h2 className="text-lg font-bold">{t('Filters.Area')}</h2>
        <Select onValueChange={handleSelectCottageArea}>
          <SelectTrigger
            className="w-[276px]"
            aria-label="Vybrať horskú oblasť"
          >
            <SelectValue placeholder="Vysoké Tatry, Malá Fatra, ..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Všetky</SelectItem>
              {availableMountainAreas.map((name) => (
                <SelectItem key={name} value={name} className="cursor-pointer">
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-bold">{t('Filters.Services')}</h2>
        <div className="flex gap-3">
          {SERVICES.map(({ id, name, icon }) => (
            <Tooltip key={id}>
              <TooltipTrigger>
                <ServiceBadge
                  onClick={() => handleSelectService(name)}
                  isActive={filterServices.includes(name)}
                  serviceBadge={{ id, name, icon }}
                  aria-label={name}
                  tabIndex={0}
                  className="cursor-pointer px-3 py-2 hover:shadow-lg"
                />
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
