import { CottageCard } from '@/components/cottage-card';
import { validateRequest } from '@/lib/auth/validateRequest';
import { getMyCottages } from '@/server/db/queries';
import Link from 'next/link';
import { NoCottagesContent } from './no-cottages-content';

const Dashboard = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const { success: cottages, error } = await getMyCottages(user.id);

  console.error({
    cottages,
    error,
  });

  return (
    <main>
      {cottages && cottages?.length < 1 ? (
        <NoCottagesContent />
      ) : (
        <div className="grid w-full grid-cols-1 place-items-center gap-8 pb-6 md:grid-cols-2 md:place-items-start lg:py-8 2xl:grid-cols-3">
          {cottages?.map((cottage) => (
            <CottageCard key={cottage.id} cottage={cottage} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
