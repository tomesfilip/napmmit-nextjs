import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { Signup } from './signup';

export const metadata = {
  title: 'Sign Up',
  description: 'Signup Page',
};

export default async function SignupPage() {
  const { user } = await validateRequest();

  if (user) {
    if (user.role === 'hiker') {
      redirect('/');
    } else {
      redirect(ROUTES.DASHBOARD.INDEX);
    }
  }

  return <Signup />;
}
