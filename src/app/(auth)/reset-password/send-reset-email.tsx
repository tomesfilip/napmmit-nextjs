'use client';

import { SubmitButton } from '@/components/form/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendPasswordResetLink } from '@/lib/auth/actions';
import { ROUTES } from '@/lib/constants';
import { MailWarningIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

export const SendResetEmail = () => {
  const [state, formAction] = useFormState(sendPasswordResetLink, null);
  const router = useRouter();
  const t = useTranslations('ResetPasswordPage');
  const tShared = useTranslations('Shared');

  useEffect(() => {
    if (state?.success) {
      toast(t('SuccessMessage'));
      router.push(ROUTES.AUTH.LOGIN);
    }
    if (state?.error) {
      toast(state.error, {
        icon: <MailWarningIcon className="h-5 w-5 text-destructive" />,
      });
    }
  }, [state?.error, state?.success, t, router]);

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label>{tShared('EmailField.Label')}</Label>
        <Input
          required
          placeholder={tShared('EmailField.Placeholder')}
          autoComplete="email"
          name="email"
          type="email"
        />
      </div>

      <div className="flex flex-wrap justify-between">
        <Link href={ROUTES.AUTH.SIGNUP}>
          <Button variant="link" size="sm" className="p-0">
            {t('SignupText')}
          </Button>
        </Link>
      </div>

      <SubmitButton className="w-full">{t('Submit')}</SubmitButton>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/">{t('Cancel')}</Link>
      </Button>
    </form>
  );
};
