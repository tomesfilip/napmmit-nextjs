import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { validateRequest } from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';
import { SendResetEmail } from './send-reset-email';

export const metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password Page',
};

export default async function ForgotPasswordPage() {
  const { user } = await validateRequest();
  const t = await getTranslations('ResetPasswordPage');

  if (user) redirect(ROUTES.DASHBOARD.INDEX);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('Title')}</CardTitle>
        <CardDescription>{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <SendResetEmail />
      </CardContent>
    </Card>
  );
}
