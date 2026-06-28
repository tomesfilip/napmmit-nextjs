import type { User } from 'lucia';
import { validateRequestFromRequest } from '@/lib/auth/validateRequest';

const ALLOWED_UPLOAD_ROLES = new Set<User['role']>(['cottage_owner', 'admin']);

export class CottageImageUploadAuthError extends Error {
  readonly status: 401 | 403;

  constructor(status: 401 | 403) {
    super(status === 401 ? 'Unauthorized' : 'Forbidden');
    this.name = 'CottageImageUploadAuthError';
    this.status = status;
  }
}

export function isCottageImageUploadAuthError(
  error: unknown,
): error is CottageImageUploadAuthError {
  return error instanceof CottageImageUploadAuthError;
}

export async function assertCanUploadCottageImages(
  request: Request,
): Promise<User> {
  const { user } = await validateRequestFromRequest(request);

  if (!user) {
    throw new CottageImageUploadAuthError(401);
  }

  if (!ALLOWED_UPLOAD_ROLES.has(user.role)) {
    throw new CottageImageUploadAuthError(403);
  }

  return user;
}
