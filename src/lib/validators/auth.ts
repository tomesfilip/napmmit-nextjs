import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z
    .string()
    .min(8, 'Password is too short. Minimum 8 characters required.')
    .max(255),
});
export type LoginInput = z.infer<typeof loginSchema>;
