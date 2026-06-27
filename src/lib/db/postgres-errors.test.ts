import { describe, expect, it } from 'vitest';
import { isUniqueConstraintViolation } from './postgres-errors';

describe('isUniqueConstraintViolation', () => {
  it('detects a unique violation error', () => {
    expect(
      isUniqueConstraintViolation({
        code: '23505',
        constraint: 'users_email_unique',
      }),
    ).toBe(true);
  });

  it('matches a specific constraint when provided', () => {
    expect(
      isUniqueConstraintViolation(
        { code: '23505', constraint: 'users_email_unique' },
        'users_email_unique',
      ),
    ).toBe(true);

    expect(
      isUniqueConstraintViolation(
        { code: '23505', constraint: 'other_constraint' },
        'users_email_unique',
      ),
    ).toBe(false);
  });

  it('detects nested cause errors', () => {
    expect(
      isUniqueConstraintViolation({
        cause: { code: '23505', constraint: 'users_email_unique' },
      }),
    ).toBe(true);
  });

  it('rejects non-unique errors', () => {
    expect(isUniqueConstraintViolation({ code: '23503' })).toBe(false);
    expect(isUniqueConstraintViolation(new Error('failed'))).toBe(false);
  });
});
