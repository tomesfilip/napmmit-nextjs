import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { DeleteAccountSection } from '@/components/profile/delete-account-section';
import { ProfileDetailsForm } from '@/components/profile/profile-details-form';
import { ProfileEmailForm } from '@/components/profile/profile-email-form';
import { validateRequest } from '@/lib/auth/validateRequest';
import {
  getActiveReservationCount,
  getOwnedCottageCount,
} from '@/lib/profile/active-reservations';
import { getDeleteAccountBlockReason } from '@/lib/profile/delete-account-guards';
import db from '@/server/db/drizzle';
import { users } from '@/server/db/schema';

const Profile = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/login');
  }

  const profileUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: {
      email: true,
      username: true,
      phoneNumber: true,
      isEmailVerified: true,
    },
  });

  if (!profileUser) {
    redirect('/login');
  }

  const [activeReservationCount, ownedCottageCount] = await Promise.all([
    getActiveReservationCount(user.id),
    getOwnedCottageCount(user.id),
  ]);

  const blockReason = getDeleteAccountBlockReason(
    activeReservationCount,
    ownedCottageCount,
  );

  const t = await getTranslations('Profile');

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">{t('Title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('Description')}</p>
      </div>

      <ProfileEmailForm
        email={profileUser.email}
        isEmailVerified={profileUser.isEmailVerified}
      />

      <ProfileDetailsForm
        username={profileUser.username}
        phoneNumber={profileUser.phoneNumber}
      />

      <DeleteAccountSection
        email={profileUser.email}
        blockReason={blockReason}
      />
    </main>
  );
};

export default Profile;
