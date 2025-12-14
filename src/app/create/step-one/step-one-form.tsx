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
import { stepOneSchema, StepOneSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { StepNavigation } from '../step-navigation';

export const StepOneForm = () => {
  const t = useTranslations('CreateCottage');

  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const storedData = useCreateFormStore((state) => state);

  const form = useForm<StepOneSchemaType>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      address: storedData.address || '',
      locationUrl: storedData.locationUrl || '',
      mountainArea: storedData.mountainArea || '',
    },
    shouldFocusError: true,
  });

  const { handleSubmit } = form;

  const onSubmit = (data: StepOneSchemaType) => {
    setData(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_TWO);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-lg font-medium">{t('StepOne.Title')}</h1>
            <p className="text-sm">{t('StepOne.Description')}</p>
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
            <FormField
              control={form.control}
              name="mountainArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('MountainArea.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('MountainArea.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('MountainArea.Description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <StepNavigation hasBackButton={false} />
        </div>
      </form>
    </Form>
  );
};
