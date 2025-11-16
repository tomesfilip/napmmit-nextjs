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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';

export const StepThreeForm = () => {
  const t = useTranslations('CreateCottage.StepThree');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const formSchema = z.object({
    pricePerNight: z.coerce.number<number>().min(1, {
      message: t('PricePerNight.Error'),
    }),
    lowPricePerNight: z.coerce
      .number<number>()
      .min(0)
      .optional()
      .or(z.literal('')),
    breakfastPrice: z.coerce
      .number<number>()
      .min(0)
      .optional()
      .or(z.literal('')),
    dinnerPrice: z.coerce.number<number>().min(0).optional().or(z.literal('')),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricePerNight: 0,
      lowPricePerNight: '',
      breakfastPrice: '',
      dinnerPrice: '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[400px] py-6"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <BackButton />
            <SubmitButton>{tNavigation('NextButton')}</SubmitButton>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="pricePerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('PricePerNight.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('PricePerNight.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('PricePerNight.Description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowPricePerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('LowPricePerNight.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('LowPricePerNight.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('LowPricePerNight.Description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakfastPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('BreakfastPrice.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('BreakfastPrice.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('BreakfastPrice.Description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dinnerPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('DinnerPrice.Label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('DinnerPrice.Placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('DinnerPrice.Description')}
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
