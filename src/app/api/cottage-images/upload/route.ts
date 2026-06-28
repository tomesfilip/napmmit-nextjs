import { type HandleUploadBody, handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { applySessionCookieToResponse } from '@/lib/auth/validateRequest';
import {
  assertCanUploadCottageImages,
  isCottageImageUploadAuthError,
} from '@/lib/cottage/upload-auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  let sessionCookie: Awaited<
    ReturnType<typeof assertCanUploadCottageImages>
  >['sessionCookie'];

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const auth = await assertCanUploadCottageImages(request);
        sessionCookie = auth.sessionCookie;

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: auth.user.id }),
        };
      },
    });

    return applySessionCookieToResponse(
      NextResponse.json(jsonResponse),
      sessionCookie,
    );
  } catch (error) {
    if (isCottageImageUploadAuthError(error)) {
      return applySessionCookieToResponse(
        NextResponse.json({ error: error.message }, { status: error.status }),
        error.sessionCookie ?? sessionCookie,
      );
    }

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
