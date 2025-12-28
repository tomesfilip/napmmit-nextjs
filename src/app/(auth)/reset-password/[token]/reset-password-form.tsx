'use client';

import { PasswordInput } from '@/components/form/password-input';
import { SubmitButton } from '@/components/form/submit-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/lib/auth/actions';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useActionState } from 'react';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(resetPassword, null);

  const t = useTranslations('ResetPasswordPage.NewPasswordForm');
  const tShared = useTranslations('Shared');

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <Label htmlFor="password">{t('NewPassword')}</Label>
        <PasswordInput
          name="password"
          required
          placeholder={tShared('PasswordField.Placeholder')}
        />
        {state?.fieldError?.password && (
          <p className="text-sm text-red-500">{state.fieldError.password}</p>
        )}
      </div>

      {state?.formError && (
        <p className="text-sm text-red-500">{state.formError}</p>
      )}

      <SubmitButton className="w-full">{t('Submit')}</SubmitButton>
      <Button>
        <Link href="/">{t('Cancel')}</Link>
      </Button>
    </form>
  );
}
