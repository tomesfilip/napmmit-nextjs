import { describe, expect, it } from 'vitest';
import type { ReservationConfirmationSummary } from '@/lib/reservation/summary';
import { getReservationConfirmationPdfFilename } from './render-reservation-confirmation-pdf';

const summary = {
  id: 42,
} as ReservationConfirmationSummary;

describe('getReservationConfirmationPdfFilename', () => {
  it('uses reservation id in filename', () => {
    expect(getReservationConfirmationPdfFilename(summary)).toBe(
      'napmmit-rezervacia-42.pdf',
    );
  });
});
