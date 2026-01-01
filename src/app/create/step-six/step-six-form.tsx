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
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/lib/constants';
import { createCottage, updateCottage } from '@/lib/cottage/actions';
import { stepSixSchema, StepSixSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { StepNavigation } from '../step-navigation';

export const StepSixForm = () => {
  const t = useTranslations('CreateCottage');

  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const cleanData = useCreateFormStore((state) => state.clean);
  const storedData = useCreateFormStore((state) => state);

  const form = useForm<StepSixSchemaType>({
    resolver: zodResolver(
      stepSixSchema
        .refine((data) => data.title.length >= 1, {
          message: t('Title.Error'),
          path: ['title'],
        })
        .refine((data) => data.title.length <= 32, {
          message: t('Title.MaxError'),
          path: ['title'],
        })
        .refine((data) => data.description.length >= 1, {
          message: t('Description.Error'),
          path: ['description'],
        }),
    ),
    defaultValues: {
      title: storedData.title || '',
      description: storedData.description || '',
    },
  });

  const { handleSubmit, watch } = form;
  const titleLength = watch('title')?.length || 0;

  const onSubmit = async (data: StepSixSchemaType) => {
    setData(data);

    try {
      const { mode, cottageId, ...cottageData } = storedData;

      if (mode === 'edit' && cottageId) {
        await updateCottage({
          cottageId,
          ...cottageData,
          ...data,
        });

        toast(t('EditSuccess'));
        router.push(`${ROUTES.COTTAGE_DETAIL}/${cottageId}`);
      }

      if (mode === 'create') {
        const newId = await createCottage({
          ...cottageData,
          ...data,
        });

        toast(t('CreateSuccess'));
        router.push(`${ROUTES.COTTAGE_DETAIL}/${newId}`);
      }

      cleanData();
    } catch (error) {
      console.error('Failed to create cottage:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-lg font-medium">{t('StepSix.Title')}</h1>
            <p className="text-sm">{t('StepSix.Description')}</p>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Title.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('Title.Placeholder')}
                      maxLength={32}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('Title.Description')} ({titleLength}/32)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Description.Label')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('Description.Placeholder')}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('Description.Description')}
                  </FormDescription>
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
