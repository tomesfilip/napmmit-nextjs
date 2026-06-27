import { describe, expect, it } from 'vitest';
import {
  formatPhoneNumber,
  isValidPhoneNumber,
  parseStoredPhoneNumber,
} from './validation';

describe('phone validation', () => {
  describe('parseStoredPhoneNumber', () => {
    it('parses E.164 numbers with dial code', () => {
      expect(parseStoredPhoneNumber('+421900123456')).toEqual({
        dialCode: '+421',
        nationalNumber: '900123456',
      });
    });

    it('parses local numbers starting with 0 as Slovak', () => {
      expect(parseStoredPhoneNumber('0900123456')).toEqual({
        dialCode: '+421',
        nationalNumber: '900123456',
      });
    });

    it('returns defaults for empty input', () => {
      expect(parseStoredPhoneNumber('')).toEqual({
        dialCode: '+421',
        nationalNumber: '',
      });
    });
  });

  describe('formatPhoneNumber', () => {
    it('combines dial code and national digits', () => {
      expect(formatPhoneNumber('+421', '900 123 456')).toBe('+421900123456');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('accepts valid Slovak mobile numbers', () => {
      expect(isValidPhoneNumber('+421900123456')).toBe(true);
    });

    it('accepts valid numbers for other supported countries', () => {
      expect(isValidPhoneNumber('+420777123456')).toBe(true);
    });

    it('rejects numbers that are too short', () => {
      expect(isValidPhoneNumber('+42190012')).toBe(false);
    });

    it('rejects invalid Slovak numbers', () => {
      expect(isValidPhoneNumber('+421800123456')).toBe(false);
    });

    it('rejects unknown dial codes', () => {
      expect(isValidPhoneNumber('+999900123456')).toBe(false);
    });

    it('rejects values longer than 20 characters', () => {
      expect(isValidPhoneNumber(`+421${'9'.repeat(18)}`)).toBe(false);
    });
  });
});
