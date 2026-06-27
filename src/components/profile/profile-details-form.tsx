'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PhoneInput } from '@/components/form/phone-input';
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
import { updatePhoneNumber, updateUsername } from '@/lib/profile/actions';
import {
  type UpdatePhoneNumberInput,
  type UpdateUsernameInput,
  updatePhoneNumberSchema,
  updateUsernameSchema,
} from '@/lib/validators/profile';

type ProfileDetailsFormProps = {
  username: string;
  phoneNumber: string;
};

export const ProfileDetailsForm = ({
  username,
  phoneNumber,
}: ProfileDetailsFormProps) => {
  return (
    <div className="grid gap-6">
      <UsernameSection initialUsername={username} />
      <PhoneSection initialPhoneNumber={phoneNumber} />
    </div>
  );
};

const toFormData = (data: Record<string, string>) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
};

const UsernameSection = ({ initialUsername }: { initialUsername: string }) => {
  const t = useTranslations('Profile');

  const form = useForm<UpdateUsernameInput>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: { username: initialUsername },
    values: { username: initialUsername },
    shouldFocusError: true,
  });

  const onSubmit = async (data: UpdateUsernameInput) => {
    const result = await updateUsername(null, toFormData(data));

    if (result?.fieldError?.username) {
      form.setError('username', { message: result.fieldError.username });
      return;
    }

    if (result?.success && result.savedUsername !== undefined) {
      form.reset({ username: result.savedUsername });
      toast.success(t('NameSection.Success'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('NameSection.Title')}</CardTitle>
        <CardDescription>{t('NameSection.Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('NameSection.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={50}
                      placeholder={t('NameSection.Placeholder')}
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
              {t('NameSection.Submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const PhoneSection = ({
  initialPhoneNumber,
}: {
  initialPhoneNumber: string;
}) => {
  const t = useTranslations('Profile');

  const form = useForm<UpdatePhoneNumberInput>({
    resolver: zodResolver(updatePhoneNumberSchema),
    defaultValues: { phoneNumber: initialPhoneNumber },
    values: { phoneNumber: initialPhoneNumber },
    shouldFocusError: true,
  });

  const onSubmit = async (data: UpdatePhoneNumberInput) => {
    const result = await updatePhoneNumber(null, toFormData(data));

    if (result?.fieldError?.phoneNumber) {
      form.setError('phoneNumber', { message: result.fieldError.phoneNumber });
      return;
    }

    if (result?.success && result.savedPhoneNumber !== undefined) {
      form.reset({ phoneNumber: result.savedPhoneNumber });
      toast.success(t('PhoneSection.Success'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('PhoneSection.Title')}</CardTitle>
        <CardDescription>{t('PhoneSection.Description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('PhoneSection.Label')}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('PhoneSection.Placeholder')}
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
              {t('PhoneSection.Submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
