'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SubmitButton } from '../submit-button';

export const StepOneForm = () => {
  const t = useTranslations('CreateCottage.StepOne');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const router = useRouter();

  const formSchema = z.object({
    address: z.string().min(2, {
      message: t('Address.Error'),
    }),
    locationUrl: z.string().min(2, {
      message: t('LocationUrl.Error'),
    }),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      locationUrl: '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_TWO);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <SubmitButton>{tNavigation('NextButton')}</SubmitButton>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Address.Label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Address.Placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('Address.Description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('LocationUrl.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('LocationUrl.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('LocationUrl.Description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
