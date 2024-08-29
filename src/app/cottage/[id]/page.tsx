import { getCottage } from '@/server/db/queries';

const CottageDetail = async ({ params }: { params: { id: number } }) => {
  const { success: cottage, error } = await getCottage(params.id);

  return (
    <main className="flex">
      {error && <div>{error}</div>}
      {cottage && <h2>{cottage.name}</h2>}
    </main>
  );
};

export default CottageDetail;
