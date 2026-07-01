import { buildReservationConfirmationPdfResponse } from '@/lib/pdf/build-pdf-response';
import { getReservationConfirmationSummaryByAccessToken } from '@/lib/reservation/summary';

type RouteContext = {
  params: Promise<{ accessToken: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { accessToken } = await context.params;
  const summary =
    await getReservationConfirmationSummaryByAccessToken(accessToken);

  if (!summary) {
    return new Response(null, { status: 404 });
  }

  return buildReservationConfirmationPdfResponse(summary);
}
