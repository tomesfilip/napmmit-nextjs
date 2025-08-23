import { CottageContent } from '@/components/cottage-content';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const { success: cottages, error } = await getCottages();

  return (
    <>
      {error && <div>{error}</div>}
      {cottages && (
        <div className="flex size-full w-full gap-8 px-4 pt-8 lg:px-12">
          <CottageContent cottages={cottages} />
        </div>
      )}
    </>
  );
};

export default Home;
