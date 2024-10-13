import { CottageContent } from '@/components/CottageContent';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const { success: cottages, error } = await getCottages();

  return (
    <>
      {error && <div>{error}</div>}
      {cottages && (
        <div className="flex size-full w-full gap-8 pt-8">
          <CottageContent cottages={cottages} />
        </div>
      )}
    </>
  );
};

export default Home;
