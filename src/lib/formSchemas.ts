import { z } from 'zod';

export const stepOneSchema = z.object({
  address: z.string().min(2),
  locationUrl: z.string().min(2),
  mountainArea: z.string().min(1),
});

export const stepTwoSchema = z.object({
  occupancy: z.coerce.number<number>().min(1),
  email: z.email(),
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
  uploadImages: z.array(z.file()).min(1),
});

export const stepFiveSchema = z.object({
  services: z.array(z.string()),
});

export const stepSixSchema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(1),
});

export const createCottageSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
  ...stepFourSchema.shape,
  ...stepFiveSchema.shape,
  ...stepSixSchema.shape,
});

export type StepOneSchemaType = z.infer<typeof stepOneSchema>;
export type StepTwoSchemaType = z.infer<typeof stepTwoSchema>;
export type StepThreeSchemaType = z.infer<typeof stepThreeSchema>;
export type StepFourSchemaType = z.infer<typeof stepFourSchema>;
export type StepFiveSchemaType = z.infer<typeof stepFiveSchema>;
export type StepSixSchemaType = z.infer<typeof stepSixSchema>;

export type CreateCottageSchemaType = z.infer<typeof createCottageSchema>;
