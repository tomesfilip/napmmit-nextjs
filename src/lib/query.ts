import { QueryClient } from '@tanstack/react-query';

export const cottageAvailabilityQueryKey = (
  cottageId: number,
  from: string | null,
  to: string | null,
) => ['cottageAvailability', cottageId, from, to] as const;

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
};
