import { renderToBuffer } from '@react-pdf/renderer';
import type { ReservationConfirmationSummary } from '@/lib/reservation/summary';
import { registerPdfFonts } from './register-fonts';
import { ReservationConfirmationDocument } from './reservation-confirmation-document';

export function getReservationConfirmationPdfFilename(
  summary: ReservationConfirmationSummary,
): string {
  return `napmmit-rezervacia-${summary.id}.pdf`;
}

export async function renderReservationConfirmationPdf(
  summary: ReservationConfirmationSummary,
): Promise<Buffer> {
  registerPdfFonts();
  const pdfBuffer = await renderToBuffer(
    <ReservationConfirmationDocument summary={summary} />,
  );
  return Buffer.from(pdfBuffer);
}
