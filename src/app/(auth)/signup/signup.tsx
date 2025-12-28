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
import { signup } from '@/lib/auth/actions';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useActionState } from 'react';

export function Signup() {
  const [state, formAction] = useActionState(signup, null);

  const t = useTranslations('SignupPage');
  const tShared = useTranslations('Shared');

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{t('Title')}</CardTitle>
        <CardDescription>{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
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
          <div className="space-y-2">
            <Label>{tShared('PasswordField.Label')}</Label>
            <PasswordInput
              name="password"
              required
              autoComplete="current-password"
              placeholder={tShared('PasswordField.Placeholder')}
            />
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
          <div>
            <Link href="/login">
              <span className="p-0 text-sm font-medium underline-offset-4 hover:underline">
                {t('LoginText')}
              </span>
            </Link>
          </div>

          <SubmitButton className="w-full">{t('Submit')}</SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">{t('Cancel')}</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
