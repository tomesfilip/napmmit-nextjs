import { and, eq, isNull } from 'drizzle-orm';
import { ROUTES } from '@/lib/constants';
import { renderReservationCreatedEmail } from '@/lib/emailTemplates/reservation-created';
import {
  mapReservationToConfirmationSummary,
  type ReservationConfirmationSummary,
} from '@/lib/reservation/summary';
import db from '@/server/db/drizzle';
import { reservations } from '@/server/db/schema';
import { sendMail } from '@/server/db/sendMail';

type ReservationForEmail = {
  id: number;
  confirmationEmailSentAt: Date | null;
  userId: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  accessToken: string | null;
  status: string;
  paymentStatus: ReservationConfirmationSummary['paymentStatus'];
  from: string;
  to: string;
  bedsReserved: number;
  pricePerNight: number;
  totalPrice: number;
  reservationFeeCents: number;
  cottage: ReservationConfirmationSummary['cottage'];
  user: {
    username: string;
    email: string;
    phoneNumber: string;
  } | null;
};

export function resolveConfirmationEmailRecipient(
  reservation: Pick<
    ReservationForEmail,
    'userId' | 'guestEmail' | 'user' | 'guestPhone'
  >,
): string | null {
  if (reservation.userId && reservation.user?.email) {
    return reservation.user.email;
  }

  if (reservation.guestEmail) {
    return reservation.guestEmail;
  }

  return null;
}

function getConfirmationEmailUrls(summary: ReservationConfirmationSummary) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is not set');
  }
  const dashboardUrl = summary.guest.isLoggedIn
    ? `${appUrl}${ROUTES.DASHBOARD.RESERVATIONS}`
    : undefined;
  const pdfUrl = summary.accessToken
    ? `${appUrl}/reservation/${summary.accessToken}/confirmation.pdf`
    : undefined;

  return { dashboardUrl, pdfUrl };
}

export async function sendReservationConfirmationEmailOnce(
  reservationId: number,
): Promise<{ success: true } | { error: string }> {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.id, reservationId),
    columns: {
      id: true,
      confirmationEmailSentAt: true,
      userId: true,
      guestEmail: true,
      guestPhone: true,
      accessToken: true,
      status: true,
      paymentStatus: true,
      from: true,
      to: true,
      bedsReserved: true,
      pricePerNight: true,
      totalPrice: true,
      reservationFeeCents: true,
    },
    with: {
      cottage: {
        columns: {
          id: true,
          name: true,
          address: true,
          email: true,
          phoneNumber: true,
          website: true,
        },
      },
      user: {
        columns: {
          username: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  if (!reservation) {
    return { error: 'reservation_not_found' };
  }

  if (reservation.confirmationEmailSentAt) {
    return { success: true };
  }

  const claimToken = crypto.randomUUID();
  const [claimedReservation] = await db
    .update(reservations)
    .set({
      confirmationEmailClaimedAt: new Date(),
      confirmationEmailClaimToken: claimToken,
    })
    .where(
      and(
        eq(reservations.id, reservationId),
        isNull(reservations.confirmationEmailSentAt),
        isNull(reservations.confirmationEmailClaimedAt),
        isNull(reservations.confirmationEmailClaimToken),
      ),
    )
    .returning({ id: reservations.id });

  if (!claimedReservation) {
    return { success: true };
  }

  const claimedReservationWhere = and(
    eq(reservations.id, reservationId),
    eq(reservations.confirmationEmailClaimToken, claimToken),
  );

  const recipient = resolveConfirmationEmailRecipient(reservation);
  if (!recipient) {
    const reason = reservation.guestPhone
      ? 'no_email_recipient_phone_only'
      : 'no_email_recipient';

    await db
      .update(reservations)
      .set({
        confirmationEmailFailedAt: new Date(),
        confirmationEmailClaimedAt: null,
        confirmationEmailClaimToken: null,
      })
      .where(claimedReservationWhere);

    console.warn(
      `Confirmation email skipped for reservation ${reservationId}: ${reason}`,
    );

    return { success: true };
  }

  try {
    const summary = mapReservationToConfirmationSummary(reservation);
    const { dashboardUrl, pdfUrl } = getConfirmationEmailUrls(summary);
    const { data, error } = await sendMail({
      to: recipient,
      subject: `Potvrdenie rezervácie – ${summary.cottage.name}`,
      body: await renderReservationCreatedEmail({
        summary,
        dashboardUrl,
        pdfUrl,
      }),
    });

    if (error) {
      await db
        .update(reservations)
        .set({
          confirmationEmailFailedAt: new Date(),
          confirmationEmailClaimedAt: null,
          confirmationEmailClaimToken: null,
        })
        .where(claimedReservationWhere);

      console.error(
        `Confirmation email failed for reservation ${reservationId}:`,
        error,
      );

      return { error: 'confirmation_email_failed' };
    }

    await db
      .update(reservations)
      .set({
        confirmationEmailSentAt: new Date(),
        confirmationEmailMessageId: data?.id ?? null,
        confirmationEmailFailedAt: null,
        confirmationEmailClaimedAt: null,
        confirmationEmailClaimToken: null,
      })
      .where(claimedReservationWhere);
  } catch (error) {
    await db
      .update(reservations)
      .set({
        confirmationEmailFailedAt: new Date(),
        confirmationEmailClaimedAt: null,
        confirmationEmailClaimToken: null,
      })
      .where(claimedReservationWhere);

    console.error(
      `Confirmation email failed for reservation ${reservationId}:`,
      error,
    );

    return { error: 'confirmation_email_failed' };
  }

  return { success: true };
}
