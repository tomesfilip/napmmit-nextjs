import { describe, expect, it } from 'vitest';
import {
  type ReservationValidationInput,
  validateReservationInputData,
} from './validation';

const validReservationInput: ReservationValidationInput = {
  userId: 'user_123',
  cottageId: 1,
  from: '2024-01-15',
  to: '2024-01-17',
  bedsReserved: 2,
  totalPrice: 120,
};

describe('reservation input validation', () => {
  it('accepts valid reservation input', () => {
    const result = validateReservationInputData(validReservationInput);

    expect(result).toMatchObject({
      success: true,
      data: {
        fromISO: '2024-01-15',
        toISO: '2024-01-17',
        pricePerNight: 60,
        reservationDates: ['2024-01-15', '2024-01-16'],
      },
    });
  });

  it('rejects missing dates', () => {
    expect(
      validateReservationInputData({ ...validReservationInput, from: '' }),
    ).toEqual({ error: 'from_date_required' });

    expect(
      validateReservationInputData({ ...validReservationInput, to: '' }),
    ).toEqual({ error: 'to_date_required' });
  });

  it('rejects invalid date ranges', () => {
    const result = validateReservationInputData({
      ...validReservationInput,
      from: '2024-01-17',
      to: '2024-01-15',
    });

    expect(result).toEqual({ error: 'to_date_before_from' });
  });

  it('rejects guest count below one', () => {
    const result = validateReservationInputData({
      ...validReservationInput,
      bedsReserved: 0,
    });

    expect(result).toEqual({ error: 'beds_required' });
  });

  it('requires email or phone for anonymous reservations', () => {
    const result = validateReservationInputData({
      ...validReservationInput,
      userId: null,
    });

    expect(result).toEqual({ error: 'missing_guest_contact' });
  });

  it('accepts anonymous reservations with contact details', () => {
    const result = validateReservationInputData({
      ...validReservationInput,
      userId: null,
      guestEmail: 'hiker@example.com',
    });

    expect(result).toMatchObject({ success: true });
  });
});
