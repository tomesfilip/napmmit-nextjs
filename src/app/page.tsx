import { CottageContent } from '@/components/CottageContent';
import { getQueryClient } from '@/lib/query';
import { getCottages } from '@/server/db/queries';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

const Home = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
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

  return (
    <main className="flex">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CottageContent />
      </HydrationBoundary>
    </main>
  );
};

export default Home;
