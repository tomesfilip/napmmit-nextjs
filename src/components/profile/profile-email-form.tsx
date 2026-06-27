'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/constants';
import { updateEmail } from '@/lib/profile/actions';
import {
  type UpdateEmailInput,
  updateEmailSchema,
} from '@/lib/validators/profile';

type ProfileEmailFormProps = {
  email: string;
  isEmailVerified: boolean | null;
};

export const ProfileEmailForm = ({
  email,
  isEmailVerified,
}: ProfileEmailFormProps) => {
  const t = useTranslations('Profile');
  const tShared = useTranslations('Shared');

  const form = useForm<UpdateEmailInput>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: '' },
    shouldFocusError: true,
  });

  const onSubmit = async (data: UpdateEmailInput) => {
    const formData = new FormData();
    formData.append('email', data.email);

    const result = await updateEmail(null, formData);

    if (result?.fieldError?.email) {
      form.setError('email', { message: result.fieldError.email });
      return;
    }

    if (result?.formError === 'same_email') {
      form.setError('email', { message: t('EmailSection.SameEmailError') });
      return;
    }

    if (result?.formError === 'email_taken') {
      form.setError('email', { message: t('EmailSection.EmailTakenError') });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('EmailSection.Title')}</CardTitle>
        <CardDescription>{t('EmailSection.Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isEmailVerified && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {t('EmailSection.NotVerified')}{' '}
            <Link
              href={ROUTES.AUTH.VERIFY_EMAIL}
              className="font-medium underline"
            >
              {t('EmailSection.VerifyLink')}
            </Link>
          </p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-email">
                {t('EmailSection.CurrentLabel')}
              </Label>
              <Input id="current-email" value={email} disabled readOnly />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tShared('EmailField.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={tShared('EmailField.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-fit"
              disabled={form.formState.isSubmitting}
            >
              {t('EmailSection.Submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
