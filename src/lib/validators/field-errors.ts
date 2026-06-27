import type { z } from 'zod';

export function getZodFieldError(
  error: z.ZodError,
  field: string,
): string | undefined {
  const fieldErrors = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;
  return fieldErrors[field]?.[0];
}
