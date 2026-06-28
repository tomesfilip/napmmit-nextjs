import { describe, expect, it } from 'vitest';
import { getSafeReturnUrl } from './safe-return-url';

const ORIGIN = 'https://napmmit.com';

describe('getSafeReturnUrl', () => {
  it('returns same-origin relative paths', () => {
    expect(getSafeReturnUrl('/dashboard', ORIGIN)).toBe('/dashboard');
    expect(getSafeReturnUrl('/create/step-one', ORIGIN)).toBe(
      '/create/step-one',
    );
  });

  it('preserves query strings on same-origin paths', () => {
    expect(getSafeReturnUrl('/dashboard?tab=1', ORIGIN)).toBe(
      '/dashboard?tab=1',
    );
  });

  it('rejects external origins', () => {
    expect(getSafeReturnUrl('https://evil.com/dashboard', ORIGIN)).toBeNull();
  });

  it('rejects invalid values', () => {
    expect(getSafeReturnUrl(null, ORIGIN)).toBeNull();
    expect(getSafeReturnUrl('', ORIGIN)).toBeNull();
  });
});
