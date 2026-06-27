import { describe, expect, it } from 'vitest';
import {
  confirmationEmailMatches,
  getDeleteAccountBlockReason,
} from './delete-account-guards';

describe('delete account guards', () => {
  describe('confirmationEmailMatches', () => {
    it('matches emails case-insensitively', () => {
      expect(
        confirmationEmailMatches('User@Example.com', 'user@example.com'),
      ).toBe(true);
    });

    it('trims whitespace before comparing', () => {
      expect(
        confirmationEmailMatches(' user@example.com ', 'user@example.com'),
      ).toBe(true);
    });

    it('rejects mismatched emails', () => {
      expect(
        confirmationEmailMatches('other@example.com', 'user@example.com'),
      ).toBe(false);
    });
  });

  describe('getDeleteAccountBlockReason', () => {
    it('blocks when active reservations exist', () => {
      expect(getDeleteAccountBlockReason(1, 0)).toBe('active_reservations');
    });

    it('blocks when user owns cottages', () => {
      expect(getDeleteAccountBlockReason(0, 1)).toBe('owned_cottages');
    });

    it('prioritizes active reservations over owned cottages', () => {
      expect(getDeleteAccountBlockReason(2, 3)).toBe('active_reservations');
    });

    it('allows deletion when no blockers exist', () => {
      expect(getDeleteAccountBlockReason(0, 0)).toBeNull();
    });
  });
});
