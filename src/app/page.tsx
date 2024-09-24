import { CottageContent } from '@/components/CottageContent';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const { success: cottages, error } = await getCottages();

  return (
    <>
      {error && <div>{error}</div>}
      {cottages && <CottageContent cottages={cottages} />}
    </>
  );
};

export default Home;
