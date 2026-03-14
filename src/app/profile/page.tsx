import { validateRequest } from '@/lib/auth/validateRequest';
import { getTranslations } from 'next-intl/server';


const Profile = async () => {
  const { user } = await validateRequest();
  const t = await getTranslations('Profile')

  if (!user) {
    return null;
  }

  return (
    <main className="py-4">
      <h1>{t('Title')}</h1>
      <p>{t('Description')}</p>
    </main>
  );
};

export default Profile;
