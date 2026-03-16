import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { validateRequest } from '@/lib/auth/validateRequest';

const Profile = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/login');
  }

  const t = await getTranslations('Profile');

  return (
    <main className="py-4">
      <h1>{t('Title')}</h1>
      <p>{t('Description')}</p>
    </main>
  );
};

export default Profile;
