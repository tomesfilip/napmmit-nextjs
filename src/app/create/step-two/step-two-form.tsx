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
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';

export const StepTwoForm = () => {
  const t = useTranslations('CreateCottage.StepTwo');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const router = useRouter();

  const formSchema = z.object({
    occupancy: z.number().min(1, {
      message: t('Occupancy.Error'),
    }),
    email: z.email({
      message: t('Email.Error'),
    }),
    phone: z.string().min(1, {
      message: t('Phone.Error'),
    }),
    website: z
      .url({
        message: t('Website.Error'),
      })
      .optional()
      .or(z.literal('')),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      occupancy: 1,
      email: '',
      phone: '',
      website: '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_THREE);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[400px] py-6"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <BackButton href={ROUTES.CREATE_COTTAGE.STEP_ONE} />
            <SubmitButton>{tNavigation('NextButton')}</SubmitButton>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="occupancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Occupancy.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder={t('Occupancy.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('Occupancy.Description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Email.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('Email.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('Email.Description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Phone.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t('Phone.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('Phone.Description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Website.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={t('Website.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('Website.Description')}</FormDescription>
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
