import type { User } from 'lucia';
import {
  type SessionCookieUpdate,
  validateRequestFromRequest,
} from '@/lib/auth/validateRequest';

const ALLOWED_UPLOAD_ROLES = new Set<User['role']>(['cottage_owner', 'admin']);

export class CottageImageUploadAuthError extends Error {
  readonly status: 401 | 403;
  readonly sessionCookie?: SessionCookieUpdate;

  constructor(status: 401 | 403, sessionCookie?: SessionCookieUpdate) {
    super(status === 401 ? 'Unauthorized' : 'Forbidden');
    this.name = 'CottageImageUploadAuthError';
    this.status = status;
    this.sessionCookie = sessionCookie;
  }
}

export function isCottageImageUploadAuthError(
  error: unknown,
): error is CottageImageUploadAuthError {
  return error instanceof CottageImageUploadAuthError;
}

export async function assertCanUploadCottageImages(
  request: Request,
): Promise<{ user: User; sessionCookie?: SessionCookieUpdate }> {
  const { result, sessionCookie } = await validateRequestFromRequest(request);
  const { user } = result;

  if (!user) {
    throw new CottageImageUploadAuthError(401, sessionCookie);
  }

  if (!ALLOWED_UPLOAD_ROLES.has(user.role)) {
    throw new CottageImageUploadAuthError(403, sessionCookie);
  }

  return { user, sessionCookie };
}
