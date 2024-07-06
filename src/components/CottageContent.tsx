'use client';

import { CottageWithServices } from '@/lib/appTypes';
import { SERVICES } from '@/server/db/constants';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { CottageCard } from './cottageCard';
import { Badge } from './ui/badge';

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

  const filteredCottages = useMemo(() => {
    if (filterServices.length > 0) {
      return cottages.filter((cottage) =>
        filterServices.every((service) =>
          cottage.cottageServices.some(
            (cottageService) => cottageService.name === service,
          ),
        ),
      );
    }
    return cottages;
  }, [cottages, filterServices]);

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

  return (
    <>
      <div className="px-8 py-12 bg-white">
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Extra služby</h2>
          <div className="flex gap-3">
            {SERVICES.map(({ name }) => (
              <Badge
                key={name}
                variant="secondary"
                className={clsx('cursor-pointer text-base', {
                  'bg-red-500': filterServices.includes(name),
                })}
                onClick={() => handleSelectService(name)}
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      {filteredCottages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 justify-center place-items-center bg-slate-200">
          {filteredCottages.map((cottage) => (
            <CottageCard key={cottage.id} cottage={cottage} />
          ))}
        </div>
      )}
    </>
  );
};
