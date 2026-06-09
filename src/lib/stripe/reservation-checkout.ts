import { parseReservationDateParam } from '@/lib/reservation-date-range';

export const RESERVATION_FEE_CENTS = 100;
export const RESERVATION_REFUND_CENTS = 50;
export const RESERVATION_CURRENCY = 'eur';

export type ReservationCheckoutMetadataInput = {
  userId?: string | null;
  cottageId: number;
  from: string;
  to: string;
  bedsReserved: number;
  totalPrice: number;
  guestEmail?: string | null;
  guestPhone?: string | null;
};

export type ReservationCheckoutMetadata = {
  userId?: string;
  cottageId: string;
  from: string;
  to: string;
  bedsReserved: string;
  totalPrice: string;
  guestEmail?: string;
  guestPhone?: string;
};

export type ParsedReservationCheckoutMetadata = {
  userId?: string;
  cottageId: number;
  from: string;
  to: string;
  bedsReserved: number;
  totalPrice: number;
  guestEmail?: string;
  guestPhone?: string;
};

export type ParseReservationCheckoutMetadataResult =
  | { success: true; data: ParsedReservationCheckoutMetadata }
  | { success: false; error: string };

export function serializeReservationCheckoutMetadata(
  input: ReservationCheckoutMetadataInput,
): ReservationCheckoutMetadata {
  return withoutEmptyValues({
    userId: input.userId ?? undefined,
    cottageId: String(input.cottageId),
    from: input.from,
    to: input.to,
    bedsReserved: String(input.bedsReserved),
    totalPrice: String(input.totalPrice),
    guestEmail: input.guestEmail ?? undefined,
    guestPhone: input.guestPhone ?? undefined,
  });
}

export function parseReservationCheckoutMetadata(
  metadata: Record<string, string | undefined>,
): ParseReservationCheckoutMetadataResult {
  const cottageId = parsePositiveInteger(metadata.cottageId);
  if (!cottageId) {
    return { success: false, error: 'missing_cottage_id' };
  }

  if (!metadata.from || !parseReservationDateParam(metadata.from)) {
    return { success: false, error: 'invalid_from_date' };
  }

  if (!metadata.to || !parseReservationDateParam(metadata.to)) {
    return { success: false, error: 'invalid_to_date' };
  }

  const bedsReserved = parsePositiveInteger(metadata.bedsReserved);
  if (!bedsReserved) {
    return { success: false, error: 'invalid_beds_reserved' };
  }

  const totalPrice = parseNonNegativeInteger(metadata.totalPrice);
  if (totalPrice === null) {
    return { success: false, error: 'invalid_total_price' };
  }

  return {
    success: true,
    data: withoutEmptyValues({
      userId: metadata.userId,
      cottageId,
      from: metadata.from,
      to: metadata.to,
      bedsReserved,
      totalPrice,
      guestEmail: metadata.guestEmail,
      guestPhone: metadata.guestPhone,
    }),
  };
}

function parsePositiveInteger(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}

function parseNonNegativeInteger(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return null;
  return parsed;
}

function withoutEmptyValues<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  ) as T;
}
