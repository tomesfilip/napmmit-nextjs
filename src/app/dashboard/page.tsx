import { CottageCard } from '@/components/cottageCard';
import { lucia } from '@/lib/auth';
import { getCottages, getCottagesByUser } from '@/server/db/queries';
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookie = (await cookies()).get('session')?.value;
  const { session } = await lucia.validateSession(cookie ?? '');
  const { success: cottages, error } = await getCottagesByUser(
    session?.userId ?? '',
  );

  return (
    <div className="space-y-4">
      <h1>Vaše chaty ({cottages?.length})</h1>
      {error && <p>{error}</p>}
      {cottages?.map((cottage) => (
        <CottageCard key={cottage.id} cottage={cottage} />
      ))}
    </div>
  );
}
