import { validateRequest } from '@/lib/auth/validateRequest';
import { buildReservationConfirmationPdfResponse } from '@/lib/pdf/build-pdf-response';
import { getReservationConfirmationSummaryById } from '@/lib/reservation/summary';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 404 });
  }

  const { id: idParam } = await context.params;
  const reservationId = Number(idParam);

  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return new Response(null, { status: 404 });
  }

  const summary = await getReservationConfirmationSummaryById(
    reservationId,
    user.id,
  );

  if (!summary) {
    return new Response(null, { status: 404 });
  }

  return buildReservationConfirmationPdfResponse(summary);
}
