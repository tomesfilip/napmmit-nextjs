import { CottageContent } from '@/components/CottageContent';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const { success: cottages, error } = await getCottages();

  return (
    <main className="flex">
      {error && <div>{error}</div>}
      {cottages && <CottageContent cottages={cottages} />}
    </main>
  );
};

export default Home;
