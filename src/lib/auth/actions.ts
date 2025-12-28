'use server';

import { lucia } from '@/lib/auth';
import { Scrypt, generateId } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { z } from 'zod';

import { eq } from 'drizzle-orm';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import db from '../../server/db/drizzle';
import {
  emailVerificationCodes,
  passwordResetTokens,
  users,
} from '../../server/db/schema';
import { sendMail } from '../../server/db/sendMail';
import { PASSWORD_ID_LENGTH, ROUTES, USER_ID_LENGTH } from '../constants';
import { renderVerificationCodeEmail } from '../emailTemplates/email-verification';
import { renderResetPasswordEmail } from '../emailTemplates/reset-password';
import {
  LoginInput,
  ResetPasswordInput,
  SignupInput,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from '../validators/auth';
import { validateRequest } from './validateRequest';

export type ActionResponse<T> = {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
};

export const login = async (
  _: any,
  formData: FormData,
): Promise<ActionResponse<LoginInput>> => {
  const obj = Object.fromEntries(formData.entries());

  const parsed = loginSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error._zod.output;
    return {
      fieldError: {
        email: err.email?.[0],
        password: err.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!existingUser) {
    return {
      formError: 'Nesprávny mail',
    };
  }

  if (!existingUser || !existingUser?.password) {
    return {
      formError: 'Nesprávny mail alebo heslo',
    };
  }

  const validPassword = await new Scrypt().verify(
    existingUser.password,
    password,
  );
  if (!validPassword) {
    return {
      formError: 'Nesprávny mail alebo heslo',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookiesStore = await cookies();
  cookiesStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(ROUTES.DASHBOARD);
};

export const signup = async (
  _: any,
  formData: FormData,
): Promise<ActionResponse<SignupInput>> => {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error._zod.output;
    return {
      fieldError: {
        email: err.email?.[0],
        password: err.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: { email: true },
  });

  if (existingUser) {
    return {
      formError: 'User with this email already exists. Log in?',
    };
  }

  const userId = generateId(USER_ID_LENGTH);
  const hashedPassword = await new Scrypt().hash(password);
  await db.insert(users).values({
    id: userId,
    email,
    password: hashedPassword,
    username: '',
    phoneNumber: '',
    isEmailVerified: false,
    role: '',
  });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  const { error } = await sendMail({
    to: email,
    subject: 'Verify your account',
    body: await renderVerificationCodeEmail({ code: verificationCode }),
  });
  if (error) {
    console.error(error);
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookiesStore = await cookies();
  cookiesStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(ROUTES.AUTH.VERIFY_EMAIL);
};

export async function logout(): Promise<void> {
  const { session } = await validateRequest();
  if (!session) {
    throw new Error('No session found');
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  const cookiesStore = await cookies();
  cookiesStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect('/');
}

const generateEmailVerificationCode = async (
  userId: string,
  email: string,
): Promise<string> => {
  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, userId));
  const code = generateRandomString(8, alphabet('0-9')); // 8 digit code
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
  });
  return code;
};

export const resendVerificationEmail = async (): Promise<{
  error?: string;
  success?: boolean;
}> => {
  const { user } = await validateRequest();
  if (!user) {
    return redirect(ROUTES.AUTH.LOGIN);
  }

  const lastSent = await db.query.emailVerificationCodes.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
    columns: { expiresAt: true },
  });

  if (lastSent && isWithinExpirationDate(lastSent.expiresAt)) {
    return {
      error: `Please wait ${timeFromNow(lastSent.expiresAt)} before resending`,
    };
  }
  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email,
  );
  await sendMail({
    to: user.email,
    subject: 'Verify your account',
    body: await renderVerificationCodeEmail({ code: verificationCode }),
  });

  return { success: true };
};

const generatePasswordResetToken = async (userId: string): Promise<string> => {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
  const tokenId = generateId(PASSWORD_ID_LENGTH);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: createDate(new TimeSpan(2, 'h')),
  });
  return tokenId;
};

const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};

export const verifyEmail = async (
  _: any,
  formData: FormData,
): Promise<{ error: string } | void> => {
  const code = formData.get('code');
  if (typeof code !== 'string' || code.length !== 8) {
    return { error: 'Invalid code' };
  }
  const { user } = await validateRequest();
  if (!user) {
    return redirect(ROUTES.AUTH.LOGIN);
  }

  const dbCode = await db.transaction(async (tx) => {
    const item = await tx.query.emailVerificationCodes.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
    });
    if (item) {
      await tx
        .delete(emailVerificationCodes)
        .where(eq(emailVerificationCodes.id, item.id));
    }
    return item;
  });

  if (!dbCode || dbCode.code !== code)
    return { error: 'Invalid verification code' };

  if (!isWithinExpirationDate(dbCode.expiresAt))
    return { error: 'Verification code expired' };

  if (dbCode.email !== user.email) return { error: 'Email does not match' };

  await lucia.invalidateUserSessions(user.id);
  await db
    .update(users)
    .set({ isEmailVerified: true })
    .where(eq(users.id, user.id));
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookiesStore = await cookies();
  cookiesStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect(ROUTES.DASHBOARD);
};

export const sendPasswordResetLink = async (
  _: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> => {
  const email = formData.get('email');
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) {
    return { error: 'Provided email is invalid.' };
  }
  try {
    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, parsed.data),
    });

    if (!user || !user.isEmailVerified)
      return { error: 'Provided email is invalid.' };

    const verificationToken = await generatePasswordResetToken(user.id);
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${verificationToken}`;

    await sendMail({
      to: user.email,
      subject: 'Reset your password',
      body: await renderResetPasswordEmail({ link: verificationLink }),
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to send verification email.' };
  }
};

export const resetPassword = async (
  _: any,
  formData: FormData,
): Promise<ActionResponse<ResetPasswordInput>> => {
  const obj = Object.fromEntries(formData.entries());

  const parsed = resetPasswordSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error._zod.output;
    return {
      fieldError: {
        token: err.token?.[0],
        password: err.password?.[0],
      },
    };
  }

  const { token, password } = parsed.data;

  try {
    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: (table, { eq }) => eq(table.id, token),
    });

    if (!existingToken) {
      return { formError: 'Invalid token.' };
    }

    if (!isWithinExpirationDate(existingToken.expiresAt)) {
      return { formError: 'Token expired.' };
    }

    await lucia.invalidateUserSessions(existingToken.userId);
    const hashedPassword = await new Scrypt().hash(password);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, existingToken.userId));
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, token));

    const session = await lucia.createSession(existingToken.userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const cookiesStore = await cookies();

    cookiesStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error) {
    console.error('Reset password error: ', error);
  }

  return redirect(ROUTES.DASHBOARD);
};
