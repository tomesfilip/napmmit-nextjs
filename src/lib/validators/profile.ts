import { z } from 'zod';
import { isValidPhoneNumber } from '@/lib/phone/validation';

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Zadajte meno.')
    .max(50, 'Meno môže mať maximálne 50 znakov.'),
});

export const updatePhoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Zadajte telefónne číslo.')
    .max(20, 'Telefónne číslo je príliš dlhé.')
    .refine(isValidPhoneNumber, 'Zadajte platné telefónne číslo.'),
});

export const updateEmailSchema = z.object({
  email: z.email('Musí byť platný e-mail.').max(100),
});

export const deleteAccountSchema = z.object({
  confirmationEmail: z.email('Musí byť platný e-mail.'),
});

export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type UpdatePhoneNumberInput = z.infer<typeof updatePhoneNumberSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
