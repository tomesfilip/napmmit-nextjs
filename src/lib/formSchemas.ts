import { z } from 'zod';

export const stepOneSchema = z.object({
  address: z.string().min(2, 'Musí obsahovat aspoň 2 znaky'),
  locationUrl: z.string().min(2, 'Musí obsahovat aspoň 2 znaky'),
  mountainArea: z.string().min(1, 'Musí byť vybraná horská oblasť'),
});

export const stepTwoSchema = z.object({
  occupancy: z.coerce.number<number>().min(1),
  email: z.email('Musí byť platný email'),
  phone: z.string().min(1),
  website: z.url().optional().or(z.literal('')),
});

export const stepThreeSchema = z.object({
  pricePerNight: z.coerce.number<number>().min(1),
  lowPricePerNight: z.coerce
    .number<number>()
    .min(0)
    .optional()
    .or(z.literal('')),
  breakfastPrice: z.coerce.number<number>().min(0).optional().or(z.literal('')),
  dinnerPrice: z.coerce.number<number>().min(0).optional().or(z.literal('')),
});

export const stepFourSchema = z.object({
  images: z
    .array(
      z.object({
        id: z.number().optional(),
        src: z.url(),
        width: z.number(),
        height: z.number(),
        order: z.number(),
      }),
    )
    .min(1),
});

export const stepFiveSchema = z.object({
  services: z.array(z.number()),
});

export const stepSixSchema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(1),
});

export const availabilitySchema = z.object({
  type: z.enum(['always', 'seasonal']),
  unavailableDates: z.array(z.date()).optional(),
});

export const createCottageSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
  ...stepFourSchema.shape,
  ...stepFiveSchema.shape,
  ...stepSixSchema.shape,
  ...availabilitySchema.shape,
});

export type StepOneSchemaType = z.infer<typeof stepOneSchema>;
export type StepTwoSchemaType = z.infer<typeof stepTwoSchema>;
export type StepThreeSchemaType = z.infer<typeof stepThreeSchema>;
export type StepFourSchemaType = z.infer<typeof stepFourSchema>;
export type StepFiveSchemaType = z.infer<typeof stepFiveSchema>;
export type StepSixSchemaType = z.infer<typeof stepSixSchema>;
export type AvailabilitySchemaType = z.infer<typeof availabilitySchema>;

export type CreateCottageSchemaType = z.infer<typeof createCottageSchema>;
