import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { NextResponse } from 'next/server';
import { createLucia } from '@/lib/auth/lucia-config';
import * as schema from '@/server/db/schema';

type SessionCookieUpdate = ReturnType<
  ReturnType<typeof createLucia>['createSessionCookie']
>;

type MiddlewareSessionResult = Awaited<
  ReturnType<ReturnType<typeof createLucia>['validateSession']>
>;

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const edgeLucia = createLucia(
  new DrizzlePostgreSQLAdapter(
    drizzle(neon(DB_URL), { schema }),
    schema.sessions,
    schema.users,
  ),
);

function resolveSessionCookieUpdate(
  result: MiddlewareSessionResult,
): SessionCookieUpdate | undefined {
  if (result.session?.fresh) {
    return edgeLucia.createSessionCookie(result.session.id);
  }

  if (!result.session) {
    return edgeLucia.createBlankSessionCookie();
  }

  return undefined;
}

function applySessionCookieToResponse(
  response: NextResponse,
  sessionCookie?: SessionCookieUpdate,
): NextResponse {
  if (!sessionCookie) {
    return response;
  }

  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return response;
}

export async function validateMiddlewareSession(request: Request): Promise<{
  result: MiddlewareSessionResult;
  sessionCookie?: SessionCookieUpdate;
}> {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const sessionId = edgeLucia.readSessionCookie(cookieHeader);

  if (!sessionId) {
    return { result: { user: null, session: null } };
  }

  const result = await edgeLucia.validateSession(sessionId);
  return {
    result,
    sessionCookie: resolveSessionCookieUpdate(result),
  };
}

export function withMiddlewareSessionCookie(
  response: NextResponse,
  sessionCookie?: SessionCookieUpdate,
): NextResponse {
  return applySessionCookieToResponse(response, sessionCookie);
}

export function isCottageManagementPath(pathname: string): boolean {
  return pathname.startsWith('/create') || pathname.startsWith('/edit');
}
