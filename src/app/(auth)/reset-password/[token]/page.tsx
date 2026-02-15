import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResetPasswordForm } from './reset-password-form';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset Password Page',
};

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Obnoviť heslo</CardTitle>
        <CardDescription>Zadajte nové heslo nižšie.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
