import { describe, expect, it } from 'vitest';
import type { ReservationConfirmationSummary } from '@/lib/reservation/summary';
import { buildReservationConfirmationInvoice } from './reservation-confirmation-invoice';

const baseSummary = {
  id: 7,
  accessToken: 'token',
  status: 'pending',
  paymentStatus: 'paid',
  from: '2024-07-15',
  to: '2024-07-17',
  nights: 2,
  bedsReserved: 2,
  pricePerNight: 25,
  accommodationTotal: 100,
  reservationFeeCents: 100,
  grandTotal: 101,
  paidAt: '2024-07-10T10:00:00.000Z',
  stripePaymentIntentId: 'pi_123',
  cottage: {
    id: 1,
    name: 'Chata',
    address: 'Tatry',
    email: null,
    phoneNumber: null,
    website: null,
  },
  guest: {
    name: 'Jana',
    email: 'jana@example.com',
    phoneNumber: null,
    isLoggedIn: true,
  },
} satisfies ReservationConfirmationSummary;

describe('buildReservationConfirmationInvoice', () => {
  it('builds invoiced reservation fee and informational accommodation lines', () => {
    const issueDate = new Date('2024-07-10T12:00:00.000Z');
    const invoice = buildReservationConfirmationInvoice(baseSummary, issueDate);

    expect(invoice.lineItems).toHaveLength(2);
    expect(invoice.lineItems[0]).toMatchObject({
      label: 'Rezervačný poplatok Napmmit',
      amount: 1,
      isInvoiced: true,
    });
    expect(invoice.lineItems[1]).toMatchObject({
      label: 'Ubytovanie – informatívny prehľad',
      amount: 100,
      isInvoiced: false,
    });
    expect(invoice.documentNumber).toBe('NR-7-20240710');
    expect(invoice.stripePaymentIntentId).toBe('pi_123');
    expect(invoice.reservationFeePaid).toBe(1);
    expect(invoice.accommodationInformationalTotal).toBe(100);
  });

  it('falls back to issue date when paidAt is missing', () => {
    const issueDate = new Date('2024-07-11T08:00:00.000Z');
    const invoice = buildReservationConfirmationInvoice(
      { ...baseSummary, paidAt: null },
      issueDate,
    );

    expect(invoice.paymentDate).toEqual(issueDate);
  });
});
