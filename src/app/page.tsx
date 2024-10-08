import { CottageContent } from '@/components/CottageContent';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const { success: cottages, error } = await getCottages();

  console.log(cottages);

  return (
    <>
      {error && <div>{error}</div>}
      {cottages && (
        <div className="flex w-full pt-8 size-full gap-8">
          <CottageContent cottages={cottages} />
        </div>
      )}
    </>
  );
};

export default Home;
