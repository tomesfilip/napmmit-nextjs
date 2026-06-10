import { describe, expect, it } from 'vitest';
import {
  calculateDailyAvailability,
  isAvailabilityBlockingStatus,
} from '@/lib/availability/logic';

describe('availability logic', () => {
  it('counts pending and confirmed reservations as unavailable beds', () => {
    const result = calculateDailyAvailability(
      4,
      new Date(2024, 0, 15),
      new Date(2024, 0, 17),
      [
        {
          from: '2024-01-15',
          to: '2024-01-17',
          bedsReserved: 1,
          status: 'pending',
        },
        {
          from: '2024-01-15',
          to: '2024-01-16',
          bedsReserved: 2,
          status: 'confirmed',
        },
      ],
    );

    expect(result.map((day) => day.availableBeds)).toEqual([1, 3]);
  });

  it('ignores cancelled and completed reservations', () => {
    const result = calculateDailyAvailability(
      4,
      new Date(2024, 0, 15),
      new Date(2024, 0, 16),
      [
        {
          from: '2024-01-15',
          to: '2024-01-16',
          bedsReserved: 4,
          status: 'cancelled',
        },
        {
          from: '2024-01-15',
          to: '2024-01-16',
          bedsReserved: 4,
          status: 'completed',
        },
      ],
    );

    expect(result[0]?.availableBeds).toBe(4);
  });

  it('exposes the blocking status rule', () => {
    expect(isAvailabilityBlockingStatus('pending')).toBe(true);
    expect(isAvailabilityBlockingStatus('confirmed')).toBe(true);
    expect(isAvailabilityBlockingStatus('cancelled')).toBe(false);
    expect(isAvailabilityBlockingStatus('completed')).toBe(false);
  });
});
