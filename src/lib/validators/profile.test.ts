import { describe, expect, it } from 'vitest';
import {
  deleteAccountSchema,
  updateEmailSchema,
  updatePhoneNumberSchema,
  updateUsernameSchema,
} from './profile';

describe('profile validators', () => {
  describe('updateUsernameSchema', () => {
    it('accepts valid username', () => {
      expect(
        updateUsernameSchema.safeParse({ username: 'Ján Novák' }).success,
      ).toBe(true);
    });

    it('rejects empty username', () => {
      expect(updateUsernameSchema.safeParse({ username: '' }).success).toBe(
        false,
      );
      expect(updateUsernameSchema.safeParse({ username: '   ' }).success).toBe(
        false,
      );
    });

    it('rejects username longer than 50 characters', () => {
      expect(
        updateUsernameSchema.safeParse({ username: 'a'.repeat(51) }).success,
      ).toBe(false);
    });
  });

  describe('updatePhoneNumberSchema', () => {
    it('accepts valid phone number', () => {
      expect(
        updatePhoneNumberSchema.safeParse({ phoneNumber: '+421900123456' })
          .success,
      ).toBe(true);
    });

    it('rejects empty phone number', () => {
      expect(
        updatePhoneNumberSchema.safeParse({ phoneNumber: '' }).success,
      ).toBe(false);
    });

    it('rejects invalid phone number format', () => {
      expect(
        updatePhoneNumberSchema.safeParse({ phoneNumber: '123' }).success,
      ).toBe(false);
    });

    it('rejects phone number longer than 20 characters', () => {
      expect(
        updatePhoneNumberSchema.safeParse({
          phoneNumber: `+421${'9'.repeat(18)}`,
        }).success,
      ).toBe(false);
    });
  });

  describe('updateEmailSchema', () => {
    it('accepts valid email', () => {
      expect(
        updateEmailSchema.safeParse({ email: 'user@example.com' }).success,
      ).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(
        updateEmailSchema.safeParse({ email: 'not-an-email' }).success,
      ).toBe(false);
    });

    it('rejects email longer than 100 characters', () => {
      const longEmail = `${'a'.repeat(90)}@example.com`;
      expect(updateEmailSchema.safeParse({ email: longEmail }).success).toBe(
        false,
      );
    });
  });

  describe('deleteAccountSchema', () => {
    it('accepts valid confirmation email', () => {
      expect(
        deleteAccountSchema.safeParse({
          confirmationEmail: 'user@example.com',
        }).success,
      ).toBe(true);
    });

    it('rejects invalid confirmation email', () => {
      expect(
        deleteAccountSchema.safeParse({ confirmationEmail: 'invalid' }).success,
      ).toBe(false);
    });
  });
});
