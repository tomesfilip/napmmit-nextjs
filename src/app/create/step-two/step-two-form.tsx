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
import { stepTwoSchema, StepTwoSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { StepNavigation } from '../step-navigation';

export const StepTwoForm = () => {
  const t = useTranslations('CreateCottage');

  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const storedData = useCreateFormStore((state) => state);

  const form = useForm<StepTwoSchemaType>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      occupancy: storedData.occupancy || 1,
      email: storedData.email || '',
      phone: storedData.phone || '',
      website: storedData.website || '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: StepTwoSchemaType) => {
    setData(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_THREE);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-lg font-medium">{t('StepTwo.Title')}</h1>
            <p className="text-sm">{t('StepTwo.Description')}</p>
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
          <StepNavigation />
        </div>
      </form>
    </Form>
  );
};
