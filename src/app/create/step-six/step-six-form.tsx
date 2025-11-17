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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';

export const StepSixForm = () => {
  const t = useTranslations('CreateCottage.StepSix');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const router = useRouter();

  const formSchema = z.object({
    title: z
      .string()
      .min(1, {
        message: t('Title.Error'),
      })
      .max(32, {
        message: t('Title.MaxError'),
      }),
    description: z.string().min(1, {
      message: t('Description.Error'),
    }),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const { handleSubmit, watch } = form;
  const titleLength = watch('title')?.length || 0;

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);

    // TODO: Save cottage to the db and retrieve its id
    const cottage = {
      id: 1,
    };
    router.push(`${ROUTES.COTTAGE_DETAIL}/${cottage.id}`);
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
