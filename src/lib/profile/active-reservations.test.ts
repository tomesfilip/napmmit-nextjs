import { describe, expect, it } from 'vitest';
import { isActiveReservationStatus } from './active-reservations';

describe('active reservation detection', () => {
  it('treats pending and confirmed as active', () => {
    expect(isActiveReservationStatus('pending')).toBe(true);
    expect(isActiveReservationStatus('confirmed')).toBe(true);
  });

  it('ignores cancelled and completed reservations', () => {
    expect(isActiveReservationStatus('cancelled')).toBe(false);
    expect(isActiveReservationStatus('completed')).toBe(false);
  });

  it('rejects unknown statuses', () => {
    expect(isActiveReservationStatus('unknown')).toBe(false);
  });
});
