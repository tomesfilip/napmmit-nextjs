import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSafeReturnUrl } from '@/lib/auth/safe-return-url';
import { validateRequest } from '@/lib/auth/validateRequest';
import { LOCAL_DEV_APP_URL, ROUTES } from '@/lib/constants';
import { Login } from './login';

export const metadata = {
  title: 'Login',
  description: 'Login Page',
};

type LoginPageProps = {
  searchParams: Promise<{ returnUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { returnUrl } = await searchParams;
  const { user } = await validateRequest();

  if (user) {
    const origin =
      (await headers()).get('origin') ??
      process.env.NEXT_PUBLIC_APP_URL ??
      LOCAL_DEV_APP_URL;
    const safeReturnUrl = getSafeReturnUrl(returnUrl, origin);
    if (safeReturnUrl) {
      redirect(safeReturnUrl);
    }

    if (user.role === 'hiker') {
      redirect('/');
    } else {
      redirect(ROUTES.DASHBOARD.INDEX);
    }
  }

  return <Login returnUrl={returnUrl} />;
}
