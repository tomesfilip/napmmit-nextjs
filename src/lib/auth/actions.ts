'use server';

import { lucia } from '@/lib/auth';
import { Scrypt, generateId } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { alphabet, generateRandomString } from 'oslo/crypto';

import { sendMail } from '@/server/db/send-mail';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate } from 'oslo';
import db from '../../server/db/drizzle';
import { emailVerificationCodes, users } from '../../server/db/schema';
import { redirects } from '../constants';
import { renderVerificationCodeEmail } from '../emailTemplates/emailVerification';
import {
  LoginInput,
  SignupInput,
  loginSchema,
  signupSchema,
} from '../validators/auth';
import { validateRequest } from './validate-request';

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
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!existingUser) {
    return {
      formError: 'Incorrect email',
    };
  }

  if (!existingUser || !existingUser?.password) {
    return {
      formError: 'Incorrect email or password',
    };
  }

  const validPassword = await new Scrypt().verify(
    existingUser.password,
    password,
  );
  if (!validPassword) {
    return {
      formError: 'Incorrect email or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(redirects.afterLogin);
};

export const signup = async (
  _: any,
  formData: FormData,
): Promise<ActionResponse<SignupInput>> => {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
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
      formError: 'Cannot create account with that email',
    };
  }

  const userId = Number(generateId(21));
  const hashedPassword = await new Scrypt().hash(password);
  await db.insert(users).values({
    id: userId,
    email,
    password: hashedPassword,
    username: '',
    phoneNumber: '',
    emailVerifiedAt: null,
    role: '',
  });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendMail({
    to: email,
    subject: 'Verify your account',
    body: renderVerificationCodeEmail({ code: verificationCode }),
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(redirects.toVerify);
};

export async function logout(): Promise<{ error: string } | void> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: 'No session found',
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect('/');
}

const generateEmailVerificationCode = async (
  userId: number,
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
