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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BackButton } from '../back-button';
import { SubmitButton } from '../submit-button';

const services = [
  { id: 'Shower', icon: 'Shower' },
  { id: 'Breakfast', icon: 'Breakfast' },
  { id: 'Dinner', icon: 'Food' },
] as const;

export const StepFiveForm = () => {
  const t = useTranslations('CreateCottage.StepFive');
  const tNavigation = useTranslations('CreateCottage.FormNavigation');

  const formSchema = z.object({
    services: z.array(z.string()),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
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
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>{t('Services.Label')}</FormLabel>
                  <FormDescription>{t('Services.Description')}</FormDescription>
                  <FormControl>
                    <div className="grid max-w-max grid-cols-2 gap-3 lg:grid-cols-3">
                      {services.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <div className="relative size-full">
                                    <Checkbox
                                      checked={field.value?.includes(
                                        service.id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              service.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== service.id,
                                              ),
                                            );
                                      }}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
                                        field.value?.includes(service.id)
                                          ? 'border-primary bg-primary/5'
                                          : 'border-border hover:border-primary/50'
                                      } `}
                                      onClick={() => {
                                        const isChecked = field.value?.includes(
                                          service.id,
                                        );
                                        if (isChecked) {
                                          field.onChange(
                                            field.value?.filter(
                                              (value) => value !== service.id,
                                            ),
                                          );
                                        } else {
                                          field.onChange([
                                            ...field.value,
                                            service.id,
                                          ]);
                                        }
                                      }}
                                    >
                                      <Icon
                                        icon={service.icon}
                                        className="mb-2 h-6 w-6 fill-black"
                                      />
                                      <span className="text-sm font-medium">
                                        {t(`Services.${service.id}`)}
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
