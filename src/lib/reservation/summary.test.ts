import { describe, expect, it } from 'vitest';
import {
  getReservationNightCount,
  getReservationPriceBreakdown,
  mapReservationToConfirmationSummary,
} from './summary';

const baseReservation = {
  id: 1,
  accessToken: 'token-123',
  status: 'pending',
  paymentStatus: 'paid' as const,
  from: '2024-07-15',
  to: '2024-07-16',
  bedsReserved: 1,
  pricePerNight: 40,
  totalPrice: 40,
  reservationFeeCents: 100,
  userId: null,
  guestEmail: 'guest@example.com',
  guestPhone: null,
  cottage: {
    id: 1,
    name: 'Chata',
    address: 'Tatry',
    email: null,
    phoneNumber: null,
    website: null,
  },
  user: null,
};

describe('reservation confirmation summary', () => {
  it('calculates one-night price breakdown', () => {
    const summary = mapReservationToConfirmationSummary(baseReservation);
    const breakdown = getReservationPriceBreakdown(summary);

    expect(summary.nights).toBe(1);
    expect(summary.pricePerNight).toBe(40);
    expect(breakdown).toEqual({
      accommodation: 40,
      reservationFee: 1,
      grandTotal: 41,
    });
  });

  it('calculates multi-night price breakdown', () => {
    const summary = mapReservationToConfirmationSummary({
      ...baseReservation,
      from: '2024-07-15',
      to: '2024-07-18',
      totalPrice: 120,
      pricePerNight: 40,
    });
    const breakdown = getReservationPriceBreakdown(summary);

    expect(getReservationNightCount(summary.from, summary.to)).toBe(3);
    expect(summary.pricePerNight).toBe(40);
    expect(breakdown).toEqual({
      accommodation: 120,
      reservationFee: 1,
      grandTotal: 121,
    });
  });

  it('calculates multiple beds in price breakdown', () => {
    const summary = mapReservationToConfirmationSummary({
      ...baseReservation,
      bedsReserved: 3,
      totalPrice: 120,
      pricePerNight: 120,
    });
    const breakdown = getReservationPriceBreakdown(summary);

    expect(summary.pricePerNight).toBe(40);
    expect(breakdown.accommodation).toBe(120);
  });

  it('normalizes persisted total-per-night price for multi-bed reservations', () => {
    const summary = mapReservationToConfirmationSummary({
      ...baseReservation,
      from: '2024-07-15',
      to: '2024-07-17',
      bedsReserved: 2,
      totalPrice: 160,
      pricePerNight: 80,
    });
    const breakdown = getReservationPriceBreakdown(summary);

    expect(summary.nights).toBe(2);
    expect(summary.accommodationTotal).toBe(160);
    expect(summary.pricePerNight).toBe(40);
    expect(breakdown.accommodation).toBe(160);
  });

  it('converts reservation fee cents to euros', () => {
    const summary = mapReservationToConfirmationSummary({
      ...baseReservation,
      reservationFeeCents: 250,
      totalPrice: 80,
    });
    const breakdown = getReservationPriceBreakdown(summary);

    expect(breakdown.reservationFee).toBe(2.5);
    expect(summary.grandTotal).toBe(82.5);
  });

  it('resolves logged-in guest contact from user record', () => {
    const summary = mapReservationToConfirmationSummary({
      ...baseReservation,
      userId: 'user_123',
      guestEmail: null,
      user: {
        username: 'Jana',
        email: 'jana@example.com',
        phoneNumber: '+421900000001',
      },
    });

    expect(summary.guest).toEqual({
      name: 'Jana',
      email: 'jana@example.com',
      phoneNumber: '+421900000001',
      isLoggedIn: true,
    });
  });

  it('resolves anonymous guest contact from guest fields', () => {
    const summary = mapReservationToConfirmationSummary(baseReservation);

    expect(summary.guest).toEqual({
      name: null,
      email: 'guest@example.com',
      phoneNumber: null,
      isLoggedIn: false,
    });
  });

  it('falls back to pending for invalid reservation statuses', () => {
    const summary = mapReservationToConfirmationSummary({
      ...baseReservation,
      status: 'invalid-status',
    });

    expect(summary.status).toBe('pending');
  });
});
