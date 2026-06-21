import { describe, expect, it } from 'vitest';
import {
  getReservationStatusBadgeClass,
  isReservationStatusType,
  parseReservationStatus,
} from './status';

describe('reservation status', () => {
  it('recognizes valid reservation statuses', () => {
    expect(isReservationStatusType('pending')).toBe(true);
    expect(isReservationStatusType('confirmed')).toBe(true);
    expect(isReservationStatusType('cancelled')).toBe(true);
    expect(isReservationStatusType('completed')).toBe(true);
  });

  it('rejects invalid reservation statuses', () => {
    expect(isReservationStatusType('invalid')).toBe(false);
    expect(isReservationStatusType('')).toBe(false);
  });

  it('falls back to pending for invalid statuses', () => {
    expect(parseReservationStatus('invalid')).toBe('pending');
    expect(parseReservationStatus('confirmed')).toBe('confirmed');
  });

  it('returns neutral badge styling for unknown statuses', () => {
    expect(getReservationStatusBadgeClass('pending')).toBe('bg-yellow-500');
    expect(getReservationStatusBadgeClass('invalid')).toBe('bg-gray-400');
  });
});
