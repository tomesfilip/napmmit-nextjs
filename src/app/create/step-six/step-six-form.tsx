'use client';

import { createCottage } from '@/app/create/step-six/actions/cottage';
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
import { stepSixSchema, StepSixSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';

export const StepSixForm = () => {
  const t = useTranslations('CreateCottage');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

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
      const { setData, clean, ...cottageData } = storedData;
      const cottageId = await createCottage({
        ...cottageData,
        ...data,
      });

      cleanData();
      router.push(`${ROUTES.COTTAGE_DETAIL}/${cottageId}`);
    } catch (error) {
      console.error('Failed to create cottage:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[400px] py-6"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <BackButton href={ROUTES.CREATE_COTTAGE.STEP_FIVE} />
            <SubmitButton>{tNavigation('NextButton')}</SubmitButton>
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
        </div>
      </form>
    </Form>
  );
};
