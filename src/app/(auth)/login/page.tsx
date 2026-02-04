import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { Login } from './login';

export const metadata = {
  title: 'Login',
  description: 'Login Page',
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) {
    if (user.role === 'hiker') {
      redirect('/');
    } else {
      redirect(ROUTES.DASHBOARD.INDEX);
    }
  }

  return <Login />;
}
