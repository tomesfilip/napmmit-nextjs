export type DeleteAccountErrorCode =
  | 'confirmation_mismatch'
  | 'active_reservations'
  | 'owned_cottages';

export function confirmationEmailMatches(
  confirmationEmail: string,
  userEmail: string,
): boolean {
  return (
    confirmationEmail.trim().toLowerCase() === userEmail.trim().toLowerCase()
  );
}

export function getDeleteAccountBlockReason(
  activeReservationCount: number,
  ownedCottageCount: number,
): Exclude<DeleteAccountErrorCode, 'confirmation_mismatch'> | null {
  if (activeReservationCount > 0) {
    return 'active_reservations';
  }

  if (ownedCottageCount > 0) {
    return 'owned_cottages';
  }

  return null;
}
