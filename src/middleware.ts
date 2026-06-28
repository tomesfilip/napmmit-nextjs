import { type NextRequest, NextResponse } from 'next/server';
import {
  isCottageManagementPath,
  validateMiddlewareSession,
  withMiddlewareSessionCookie,
} from '@/lib/auth/middleware-session';
import { canManageCottages } from '@/lib/auth/roles';
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

export async function middleware(request: NextRequest) {
  const { result, sessionCookie } = await validateMiddlewareSession(request);
  const { user } = result;
  const pathname = request.nextUrl.pathname;

  if (!user) {
    return withMiddlewareSessionCookie(redirectToLogin(request), sessionCookie);
  }

  if (isCottageManagementPath(pathname) && !canManageCottages(user.role)) {
    return withMiddlewareSessionCookie(
      NextResponse.redirect(new URL(ROUTES.DASHBOARD.INDEX, request.url)),
      sessionCookie,
    );
  }

  return withMiddlewareSessionCookie(NextResponse.next(), sessionCookie);
}
