import { describe, expect, it } from 'vitest';
import {
  parseReservationCheckoutMetadata,
  RESERVATION_CURRENCY,
  RESERVATION_FEE_CENTS,
  RESERVATION_REFUND_CENTS,
  serializeReservationCheckoutMetadata,
} from './reservation-checkout';

describe('reservation checkout helpers', () => {
  it('defines cents-based reservation payment constants', () => {
    expect(RESERVATION_FEE_CENTS).toBe(100);
    expect(RESERVATION_REFUND_CENTS).toBe(50);
    expect(RESERVATION_CURRENCY).toBe('eur');
  });

  it('serializes numeric metadata values as strings', () => {
    const metadata = serializeReservationCheckoutMetadata({
      userId: 'user_123',
      cottageId: 42,
      from: '2024-01-15',
      to: '2024-01-17',
      bedsReserved: 2,
      totalPrice: 120,
    });

    expect(metadata).toEqual({
      userId: 'user_123',
      cottageId: '42',
      from: '2024-01-15',
      to: '2024-01-17',
      bedsReserved: '2',
      totalPrice: '120',
    });
  });

  it('parses valid metadata and preserves anonymous contact fields', () => {
    const result = parseReservationCheckoutMetadata({
      cottageId: '42',
      from: '2024-01-15',
      to: '2024-01-17',
      bedsReserved: '2',
      totalPrice: '120',
      guestEmail: 'hiker@example.com',
      guestPhone: '+421900000000',
    });

    expect(result).toEqual({
      success: true,
      data: {
        cottageId: 42,
        from: '2024-01-15',
        to: '2024-01-17',
        bedsReserved: 2,
        totalPrice: 120,
        guestEmail: 'hiker@example.com',
        guestPhone: '+421900000000',
      },
    });
  });

  it('rejects missing cottage id', () => {
    const result = parseReservationCheckoutMetadata({
      from: '2024-01-15',
      to: '2024-01-17',
      bedsReserved: '2',
      totalPrice: '120',
    });

    expect(result).toEqual({ success: false, error: 'missing_cottage_id' });
  });

  it('rejects invalid date values', () => {
    const result = parseReservationCheckoutMetadata({
      cottageId: '42',
      from: '2024-02-31',
      to: '2024-01-17',
      bedsReserved: '2',
      totalPrice: '120',
    });

    expect(result).toEqual({ success: false, error: 'invalid_from_date' });
  });

  it('rejects non-numeric beds reserved values', () => {
    const result = parseReservationCheckoutMetadata({
      cottageId: '42',
      from: '2024-01-15',
      to: '2024-01-17',
      bedsReserved: 'two',
      totalPrice: '120',
    });

    expect(result).toEqual({
      success: false,
      error: 'invalid_beds_reserved',
    });
  });
});
