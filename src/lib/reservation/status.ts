import type { ReservationStatusType } from '@/lib/appTypes';
import { reservationStatusEnum } from '@/server/db/schema';

export const RESERVATION_STATUSES = reservationStatusEnum.enumValues;

export function isReservationStatusType(
  value: string,
): value is ReservationStatusType {
  return (RESERVATION_STATUSES as readonly string[]).includes(value);
}

export function parseReservationStatus(
  value: string,
  fallback: ReservationStatusType = 'pending',
): ReservationStatusType {
  return isReservationStatusType(value) ? value : fallback;
}

export const RESERVATION_STATUS_BADGE_CLASSES: Record<
  ReservationStatusType,
  string
> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-600',
  cancelled: 'bg-red-500',
  completed: 'bg-blue-600',
};

export function getReservationStatusBadgeClass(status: string): string {
  return isReservationStatusType(status)
    ? RESERVATION_STATUS_BADGE_CLASSES[status]
    : 'bg-gray-400';
}
