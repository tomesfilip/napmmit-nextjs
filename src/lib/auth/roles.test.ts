import { describe, expect, it } from 'vitest';
import { canManageCottages } from './roles';

describe('canManageCottages', () => {
  it('returns true for cottage_owner and admin', () => {
    expect(canManageCottages('cottage_owner')).toBe(true);
    expect(canManageCottages('admin')).toBe(true);
  });

  it('returns false for hiker', () => {
    expect(canManageCottages('hiker')).toBe(false);
  });
});
