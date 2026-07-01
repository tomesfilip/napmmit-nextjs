import { ROUTES } from '@/lib/constants';
import type { ReservationConfirmationSummary } from '@/lib/reservation/summary';

export type ReservationConfirmationVariant = 'post_payment' | 'dashboard';

export function getPdfDownloadHref(
  summary: ReservationConfirmationSummary,
  variant: ReservationConfirmationVariant,
) {
  if (variant === 'dashboard') {
    return ROUTES.DASHBOARD.RESERVATION_PDF(summary.id);
  }

  if (!summary.accessToken) {
    return null;
  }

  return ROUTES.RESERVATION.CONFIRMATION_PDF(summary.accessToken);
}
