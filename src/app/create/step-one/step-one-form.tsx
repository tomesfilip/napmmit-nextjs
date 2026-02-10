'use client';

import { Icon } from '@/components/shared/icon';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { COTTAGE_AREAS, ROUTES } from '@/lib/constants';
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
                  <FormLabel className="flex items-center gap-2">
                    <span>{t('LocationUrl.Label')}</span>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <Icon
                          icon="Info"
                          className="size-4 rounded-sm fill-black transition-colors hover:bg-slate-200"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {t('LocationUrl.Tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
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
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="Vybrať horskú oblasť">
                        <SelectValue placeholder="Vysoké Tatry, Malá Fatra, ..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Všetky</SelectItem>
                          {COTTAGE_AREAS.map(({ name }) => (
                            <SelectItem
                              key={name}
                              value={name}
                              className="cursor-pointer"
                            >
                              {name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
