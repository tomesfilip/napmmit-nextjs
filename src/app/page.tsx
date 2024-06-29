import { CottageCard } from '@/components/cottageCard';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const cottages = await getCottages();

  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 justify-center place-items-center">
        {cottages.map((cottage) => (
          <CottageCard key={cottage.id} cottage={cottage} />
        ))}
      </div>
    </main>
  );
};

export default Home;
