'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { deleteAccount } from '@/lib/profile/actions';
import type { DeleteAccountErrorCode } from '@/lib/profile/delete-account-guards';
import {
  type DeleteAccountInput,
  deleteAccountSchema,
} from '@/lib/validators/profile';

type DeleteAccountSectionProps = {
  email: string;
  blockReason: Exclude<DeleteAccountErrorCode, 'confirmation_mismatch'> | null;
};

export const DeleteAccountSection = ({
  email,
  blockReason,
}: DeleteAccountSectionProps) => {
  const t = useTranslations('Profile');
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmationEmail: '' },
    shouldFocusError: true,
  });

  const confirmationEmail = form.watch('confirmationEmail');
  const emailMatches =
    confirmationEmail.trim().toLowerCase() === email.trim().toLowerCase();

  const onSubmit = async (data: DeleteAccountInput) => {
    setServerError(null);

    const formData = new FormData();
    formData.append('confirmationEmail', data.confirmationEmail);

    const result = await deleteAccount(null, formData);

    if (result?.fieldError?.confirmationEmail) {
      form.setError('confirmationEmail', {
        message: result.fieldError.confirmationEmail,
      });
      return;
    }

    const errorMessage =
      result?.errorCode === 'confirmation_mismatch'
        ? t('DeleteAccount.Errors.ConfirmationMismatch')
        : result?.errorCode === 'active_reservations'
          ? t('DeleteAccount.Errors.ActiveReservations')
          : result?.errorCode === 'owned_cottages'
            ? t('DeleteAccount.Errors.OwnedCottages')
            : result?.formError === 'delete_failed'
              ? t('DeleteAccount.Errors.Generic')
              : null;

    if (errorMessage) {
      setServerError(errorMessage);
    }
  };

  const blockMessage =
    blockReason === 'active_reservations'
      ? t('DeleteAccount.Errors.ActiveReservations')
      : blockReason === 'owned_cottages'
        ? t('DeleteAccount.Errors.OwnedCottages')
        : null;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">
          {t('DeleteAccount.Title')}
        </CardTitle>
        <CardDescription>{t('DeleteAccount.Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {blockMessage ? (
          <p className="mb-4 rounded-lg border bg-destructive/10 p-3 text-sm text-destructive">
            {blockMessage}
          </p>
        ) : null}

        <AlertDialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              form.reset();
              setServerError(null);
            }
          }}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={Boolean(blockReason)}>
              {t('DeleteAccount.Button')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('DeleteAccount.ModalTitle')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('DeleteAccount.ModalDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="confirmationEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('DeleteAccount.ConfirmationLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder={t(
                            'DeleteAccount.ConfirmationPlaceholder',
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {serverError && (
                  <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                    {serverError}
                  </p>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">
                    {t('DeleteAccount.Cancel')}
                  </AlertDialogCancel>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={!emailMatches || form.formState.isSubmitting}
                  >
                    {t('DeleteAccount.Confirm')}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
