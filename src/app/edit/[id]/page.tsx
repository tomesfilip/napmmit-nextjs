import { notFound, redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { getCottageIfOwned } from '@/lib/cottage/ownership';
import { EditCottageLoader } from './edit-cottage-loader';

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: EditPageProps) {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const cottageId = Number(id);

  if (!Number.isInteger(cottageId) || cottageId <= 0) {
    redirect(ROUTES.DASHBOARD.INDEX);
  }

  const cottage = await getCottageIfOwned(cottageId, user);

  if (!cottage) {
    notFound();
  }

  return (
    <EditCottageLoader cottage={cottage} cottageId={cottageId} editId={id} />
  );
}
