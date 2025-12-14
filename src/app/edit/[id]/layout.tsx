import { validateRequest } from '@/lib/auth/validateRequest';
import { redirect } from 'next/navigation';
import ProgressBar from '../../create/progress-bar';

const EditLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="relative flex size-full justify-center gap-8 px-4 py-5 lg:px-12">
      <ProgressBar />
      <div className="min-h-dvh w-full max-w-[420px]">{children}</div>
    </div>
  );
};

export default EditLayout;
