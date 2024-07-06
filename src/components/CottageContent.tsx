'use client';

import { SERVICES } from '@/server/db/constants';
import { getCottages } from '@/server/db/queries';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { CottageCard } from './cottageCard';
import { Badge } from './ui/badge';

export const CottageContent = () => {
  const { data: cottages, error } = useQuery({
    queryKey: ['cottages'],
    queryFn: async () => {
      const cottages = await getCottages();
      if (cottages.error) {
        throw new Error(cottages.error);
      }
      if (cottages.success) {
        return cottages.success;
      }
    },
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSelectService = (service: string) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  if (error) {
    return <div>{error.message}</div>;
  }
  if (cottages) {
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
                    'bg-red-500': selectedServices.includes(name),
                  })}
                  onClick={() => handleSelectService(name)}
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        {cottages && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 justify-center place-items-center bg-slate-200">
            {cottages.map((cottage) => (
              <CottageCard key={cottage.id} cottage={cottage} />
            ))}
          </div>
        )}
      </>
    );
  }
};
