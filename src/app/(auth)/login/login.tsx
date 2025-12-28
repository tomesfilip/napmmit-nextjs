'use client';

import { PasswordInput } from '@/components/form/password-input';
import { SubmitButton } from '@/components/form/submit-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/auth/actions';
import { ROUTES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useActionState } from 'react';

export const Login = () => {
  const [state, formAction] = useActionState(login, null);

  const t = useTranslations('LoginPage');
  const tShared = useTranslations('Shared');

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{t('Title')}</CardTitle>
        <CardDescription>{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t border-muted" />
          <div className="mx-2 text-muted-foreground">{t('OrDivider')}</div>
          <div className="flex-grow border-t border-muted" />
        </div>
        <form action={formAction} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{tShared('EmailField.Label')}</Label>
            <Input
              required
              placeholder={tShared('EmailField.Placeholder')}
              autoComplete="email"
              name="email"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{tShared('PasswordField.Label')}</Label>
            <PasswordInput
              name="password"
              required
              autoComplete="current-password"
              placeholder={tShared('PasswordField.Placeholder')}
            />
          </div>

          <div className="flex flex-wrap justify-between">
            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href={ROUTES.AUTH.SIGNUP}>{t('SignupText')}</Link>
            </Button>
            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href={ROUTES.AUTH.RESET_PASSWORD}>
                {t('ForgotPassword')}
              </Link>
            </Button>
          </div>

          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}
          <SubmitButton className="w-full">{t('Submit')}</SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">{t('Cancel')}</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
