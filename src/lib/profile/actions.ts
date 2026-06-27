'use server';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { lucia } from '@/lib/auth';
import type { ActionResponse } from '@/lib/auth/actions';
import { generateEmailVerificationCode } from '@/lib/auth/email-verification';
import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { renderVerificationCodeEmail } from '@/lib/emailTemplates/email-verification';
import {
  getActiveReservationCount,
  getOwnedCottageCount,
} from '@/lib/profile/active-reservations';
import {
  confirmationEmailMatches,
  type DeleteAccountErrorCode,
  getDeleteAccountBlockReason,
} from '@/lib/profile/delete-account-guards';
import { getZodFieldError } from '@/lib/validators/field-errors';
import {
  type DeleteAccountInput,
  deleteAccountSchema,
  type UpdateEmailInput,
  type UpdatePhoneNumberInput,
  type UpdateUsernameInput,
  updateEmailSchema,
  updatePhoneNumberSchema,
  updateUsernameSchema,
} from '@/lib/validators/profile';
import db from '@/server/db/drizzle';
import { reservations, users } from '@/server/db/schema';
import { sendMail } from '@/server/db/sendMail';

export type ProfileActionResponse<T> = ActionResponse<T> & {
  success?: boolean;
  errorCode?: DeleteAccountErrorCode;
  savedUsername?: string;
  savedPhoneNumber?: string;
};

export async function updateUsername(
  _: ProfileActionResponse<UpdateUsernameInput> | null,
  formData: FormData,
): Promise<ProfileActionResponse<UpdateUsernameInput>> {
  const { user } = await validateRequest();
  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const parsed = updateUsernameSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return {
      fieldError: {
        username: getZodFieldError(parsed.error, 'username'),
      },
    };
  }

  await db
    .update(users)
    .set({ username: parsed.data.username, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { success: true, savedUsername: parsed.data.username };
}

export async function updatePhoneNumber(
  _: ProfileActionResponse<UpdatePhoneNumberInput> | null,
  formData: FormData,
): Promise<ProfileActionResponse<UpdatePhoneNumberInput>> {
  const { user } = await validateRequest();
  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const parsed = updatePhoneNumberSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return {
      fieldError: {
        phoneNumber: getZodFieldError(parsed.error, 'phoneNumber'),
      },
    };
  }

  await db
    .update(users)
    .set({ phoneNumber: parsed.data.phoneNumber, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { success: true, savedPhoneNumber: parsed.data.phoneNumber };
}

export async function updateEmail(
  _: ProfileActionResponse<UpdateEmailInput> | null,
  formData: FormData,
): Promise<ProfileActionResponse<UpdateEmailInput>> {
  const { user } = await validateRequest();
  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const parsed = updateEmailSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return {
      fieldError: { email: getZodFieldError(parsed.error, 'email') },
    };
  }

  const { email: newEmail } = parsed.data;

  if (newEmail.toLowerCase() === user.email.toLowerCase()) {
    return { formError: 'same_email' };
  }

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, newEmail),
    columns: { id: true },
  });

  if (existingUser) {
    return { formError: 'email_taken' };
  }

  await db
    .update(users)
    .set({
      email: newEmail,
      isEmailVerified: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    newEmail,
  );
  const { error } = await sendMail({
    to: newEmail,
    subject: 'Verify your account',
    body: await renderVerificationCodeEmail({ code: verificationCode }),
  });
  if (error) {
    console.error(error);
  }

  await lucia.invalidateUserSessions(user.id);
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookiesStore = await cookies();
  cookiesStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect(ROUTES.AUTH.VERIFY_EMAIL);
}

export async function deleteAccount(
  _: ProfileActionResponse<DeleteAccountInput> | null,
  formData: FormData,
): Promise<ProfileActionResponse<DeleteAccountInput>> {
  const { user } = await validateRequest();
  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const parsed = deleteAccountSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return {
      fieldError: {
        confirmationEmail: getZodFieldError(parsed.error, 'confirmationEmail'),
      },
    };
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { email: true },
  });

  if (!dbUser) {
    return { formError: 'delete_failed', errorCode: 'confirmation_mismatch' };
  }

  if (!confirmationEmailMatches(parsed.data.confirmationEmail, dbUser.email)) {
    return {
      errorCode: 'confirmation_mismatch',
      formError: 'confirmation_mismatch',
    };
  }

  const [activeReservationCount, ownedCottageCount] = await Promise.all([
    getActiveReservationCount(user.id),
    getOwnedCottageCount(user.id),
  ]);

  const blockReason = getDeleteAccountBlockReason(
    activeReservationCount,
    ownedCottageCount,
  );
  if (blockReason) {
    return { errorCode: blockReason, formError: blockReason };
  }

  try {
    await lucia.invalidateUserSessions(user.id);

    await db.transaction(async (tx) => {
      await tx
        .update(reservations)
        .set({ userId: null })
        .where(eq(reservations.userId, user.id));
      await tx.delete(users).where(eq(users.id, user.id));
    });

    const sessionCookie = lucia.createBlankSessionCookie();
    const cookiesStore = await cookies();
    cookiesStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error) {
    console.error('Account deletion failed:', error);
    return { formError: 'delete_failed' };
  }

  redirect('/');
}
