import { CottageContent } from '@/components/CottageContent';
import { Search } from '@/components/ui/search';
import { getCottages } from '@/server/db/queries';

const Home = async () => {
  const { success: cottages, error } = await getCottages();

  return (
    <>
      {error && <div>{error}</div>}
      {cottages && (
        <div className="flex flex-col size-full pt-8 items-center">
          {/* <Search placeholder="Vysoké Tatry, Bílkova Chata, ..." /> */}
          <CottageContent cottages={cottages} />
        </div>
      )}
    </>
  );
};

export default Home;
