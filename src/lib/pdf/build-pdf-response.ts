import type { ReservationConfirmationSummary } from '@/lib/reservation/summary';
import {
  getReservationConfirmationPdfFilename,
  renderReservationConfirmationPdf,
} from './render-reservation-confirmation-pdf';

export async function buildReservationConfirmationPdfResponse(
  summary: ReservationConfirmationSummary,
) {
  const pdfBuffer = await renderReservationConfirmationPdf(summary);
  const filename = getReservationConfirmationPdfFilename(summary);

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
