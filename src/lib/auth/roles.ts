import type { User } from 'lucia';

const COTTAGE_MANAGEMENT_ROLES = new Set<User['role']>([
  'cottage_owner',
  'admin',
]);

export function canManageCottages(role: User['role']): boolean {
  return COTTAGE_MANAGEMENT_ROLES.has(role);
}
