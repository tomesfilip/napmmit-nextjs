import { differenceInDays, format } from 'date-fns';
import type { PaymentStatusType, ReservationStatusType } from '@/lib/appTypes';
import { parseReservationDateParam } from '@/lib/reservation-date-range';

export type ReservationConfirmationSummary = {
  id: number;
  accessToken: string | null;
  status: ReservationStatusType;
  paymentStatus: PaymentStatusType;
  from: string;
  to: string;
  nights: number;
  bedsReserved: number;
  pricePerNight: number;
  accommodationTotal: number;
  reservationFeeCents: number;
  grandTotal: number;
  cottage: {
    id: number;
    name: string;
    address: string;
    email: string | null;
    phoneNumber: string | null;
    website: string | null;
  };
  guest: {
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
    isLoggedIn: boolean;
  };
};

export type ReservationSummarySource = {
  id: number;
  accessToken: string | null;
  status: string;
  paymentStatus: PaymentStatusType;
  from: string;
  to: string;
  bedsReserved: number;
  pricePerNight: number;
  totalPrice: number;
  reservationFeeCents: number;
  userId: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  cottage: ReservationConfirmationSummary['cottage'];
  user: {
    username: string;
    email: string;
    phoneNumber: string;
  } | null;
};

export function formatReservationSummaryDate(ymd: string) {
  const date = parseReservationDateParam(ymd);
  return date ? format(date, 'dd.MM.yyyy') : ymd;
}

export function getReservationNightCount(from: string, to: string) {
  const fromDate = parseReservationDateParam(from);
  const toDate = parseReservationDateParam(to);
  if (!fromDate || !toDate) {
    return 0;
  }
  return differenceInDays(toDate, fromDate);
}

export function mapReservationToConfirmationSummary(
  reservation: ReservationSummarySource,
): ReservationConfirmationSummary {
  const nights = getReservationNightCount(reservation.from, reservation.to);
  const accommodationTotal = reservation.totalPrice;
  const reservationFee = reservation.reservationFeeCents / 100;

  return {
    id: reservation.id,
    accessToken: reservation.accessToken,
    status: reservation.status as ReservationStatusType,
    paymentStatus: reservation.paymentStatus,
    from: reservation.from,
    to: reservation.to,
    nights,
    bedsReserved: reservation.bedsReserved,
    pricePerNight: reservation.pricePerNight,
    accommodationTotal,
    reservationFeeCents: reservation.reservationFeeCents,
    grandTotal: accommodationTotal + reservationFee,
    cottage: reservation.cottage,
    guest: {
      name: reservation.user?.username ?? null,
      email: reservation.user?.email ?? reservation.guestEmail,
      phoneNumber: reservation.user?.phoneNumber ?? reservation.guestPhone,
      isLoggedIn: reservation.userId !== null,
    },
  };
}

export function getReservationPriceBreakdown(
  summary: ReservationConfirmationSummary,
) {
  return {
    accommodation:
      summary.nights * summary.pricePerNight * summary.bedsReserved,
    reservationFee: summary.reservationFeeCents / 100,
    grandTotal: summary.grandTotal,
  };
}

export {
  getReservationConfirmationSummaryByAccessToken,
  getReservationConfirmationSummaryByCheckoutSession,
} from './summary-queries';
