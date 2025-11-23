'use client';

import { Icon } from '@/components/shared/icon';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ROUTES, SERVICES } from '@/lib/constants';
import { stepFiveSchema, StepFiveSchemaType } from '@/lib/formSchemas';
import { useCreateFormStore } from '@/stores/createFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';

export const StepFiveForm = () => {
  const t = useTranslations('CreateCottage');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const router = useRouter();

  const setData = useCreateFormStore((state) => state.setData);
  const storedData = useCreateFormStore((state) => state);

  const form = useForm<StepFiveSchemaType>({
    resolver: zodResolver(stepFiveSchema),
    defaultValues: {
      services: storedData.services || [],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: StepFiveSchemaType) => {
    setData(data);
    router.push(ROUTES.CREATE_COTTAGE.STEP_SIX);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[400px] py-6"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <BackButton href={ROUTES.CREATE_COTTAGE.STEP_FOUR} />
            <SubmitButton>{tNavigation('NextButton')}</SubmitButton>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>{t('Services.Label')}</FormLabel>
                  <FormDescription>{t('Services.Description')}</FormDescription>
                  <FormControl>
                    <div className="grid max-w-max grid-cols-2 gap-3 lg:grid-cols-3">
                      {SERVICES.map((service) => (
                        <FormField
                          key={service.name}
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service.name}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <div className="relative size-full">
                                    <Checkbox
                                      checked={field.value?.includes(
                                        service.name,
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              service.name,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value !== service.name,
                                              ),
                                            );
                                      }}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
                                        field.value?.includes(service.name)
                                          ? 'border-primary bg-primary/5'
                                          : 'border-border hover:border-primary/50'
                                      } `}
                                      onClick={() => {
                                        const isChecked = field.value?.includes(
                                          service.name,
                                        );
                                        if (isChecked) {
                                          field.onChange(
                                            field.value?.filter(
                                              (value) => value !== service.name,
                                            ),
                                          );
                                        } else {
                                          field.onChange([
                                            ...field.value,
                                            service.name,
                                          ]);
                                        }
                                      }}
                                    >
                                      <Icon
                                        icon={service.icon}
                                        className="mb-2 h-6 w-6 fill-black"
                                      />
                                      <span className="text-sm font-medium">
                                        {service.name}
                                      </span>
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
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
