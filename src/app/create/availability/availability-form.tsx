'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTES } from '@/lib/constants';
import { availabilitySchema, AvailabilitySchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { StepNavigation } from '../step-navigation';

export const AvailabilityForm = () => {
  const t = useTranslations('CreateCottage');

  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const storedData = useCreateFormStore((state) => state);

  const form = useForm<AvailabilitySchemaType>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      type: storedData.unavailableDates ? 'seasonal' : 'always',
      unavailableDates: storedData.unavailableDates || [],
    },
  });

  const { handleSubmit, watch, setValue } = form;
  const watchedDates = watch('unavailableDates') || [];

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const currentDates = watchedDates;
    const dateExists = currentDates.some((d) => d.getTime() === date.getTime());

    if (dateExists) {
      setValue(
        'unavailableDates',
        currentDates.filter((d) => d.getTime() !== date.getTime()),
      );
    } else {
      setValue('unavailableDates', [...currentDates, date]);
    }
  };

  const onSubmit = (data: AvailabilitySchemaType) => {
    setData(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_SIX);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-lg font-medium">{t('Availability.Title')}</h1>
            <p className="text-sm">{t('Availability.Description')}</p>
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="always">
                        {t('Availability.AlwaysAvailable')}
                      </TabsTrigger>
                      <TabsTrigger value="seasonal">
                        {t('Availability.Seasonal')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="always" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t('Availability.AlwaysCard.Title')}
                          </CardTitle>
                          <CardDescription>
                            {t('Availability.AlwaysCard.Description')}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </TabsContent>

                    <TabsContent value="seasonal" className="mt-4 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t('Availability.SeasonalCard.Title')}
                          </CardTitle>
                          <CardDescription>
                            {t('Availability.SeasonalCard.Description')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Calendar
                            mode="single"
                            selected={undefined}
                            onSelect={handleDateSelect}
                            modifiers={{
                              unavailable: watchedDates,
                            }}
                            modifiersClassNames={{
                              unavailable:
                                'bg-destructive text-destructive-foreground rounded-md',
                            }}
                            className="w-full rounded-md border"
                          />
                          {watchedDates.length > 0 && (
                            <div className="mt-4">
                              <p className="mb-2 text-sm font-medium">
                                {t('Availability.SeasonalCard.SelectedDates')} (
                                {watchedDates.length}):
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {watchedDates
                                  .sort((a, b) => a.getTime() - b.getTime())
                                  .map((date, index) => (
                                    <Button
                                      key={index}
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDateSelect(date)}
                                      className="h-6 text-xs"
                                    >
                                      {date.toLocaleDateString()} ×
                                    </Button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <StepNavigation hasBackButton={true} />
        </div>
      </form>
    </Form>
  );
};
