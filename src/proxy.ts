import { type NextRequest, NextResponse } from 'next/server';
import { canManageCottages } from '@/lib/auth/roles';
import { isCottageManagementPath } from '@/lib/auth/route-guards';
import { ROUTE_NOTICE } from '@/lib/auth/route-notices';
import {
  applySessionCookieToResponse,
  validateRequestFromRequest,
} from '@/lib/auth/validateRequest';
import { ROUTES } from '@/lib/constants';

export const config = {
  matcher: ['/dashboard/:path*', '/create/:path*', '/edit/:path*', '/profile'],
};

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
  loginUrl.searchParams.set(
    'returnUrl',
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { result, sessionCookie } = await validateRequestFromRequest(request);
  const { user } = result;
  const pathname = request.nextUrl.pathname;

  if (!user) {
    return applySessionCookieToResponse(
      redirectToLogin(request),
      sessionCookie,
    );
  }

  if (isCottageManagementPath(pathname) && !canManageCottages(user.role)) {
    const redirectUrl = new URL(ROUTES.DASHBOARD.RESERVATIONS, request.url);
    redirectUrl.searchParams.set('notice', ROUTE_NOTICE.OWNER_ONLY);

    return applySessionCookieToResponse(
      NextResponse.redirect(redirectUrl),
      sessionCookie,
    );
  }

  return applySessionCookieToResponse(NextResponse.next(), sessionCookie);
}
