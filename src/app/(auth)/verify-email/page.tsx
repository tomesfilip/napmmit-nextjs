import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { validateRequest } from '@/lib/auth/validateRequest';
import { redirects } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { VerifyCode } from './verifyCode';

export const metadata = {
  title: 'Verify Email',
  description: 'Verify Email Page',
};

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();

  if (!user) redirect(redirects.toLogin);
  if (user.isEmailVerified) redirect(redirects.afterVerify);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Verification code was sent to <strong>{user.email}</strong>. Check
          your spam folder if you can&apos;t find the email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCode />
      </CardContent>
    </Card>
  );
}
