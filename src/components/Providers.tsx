'use client';

import { getQueryClient } from '@/lib/query';
import { QueryClientProvider } from '@tanstack/react-query';

import { ReactNode } from 'react';

const queryClient = getQueryClient();

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default Providers;
