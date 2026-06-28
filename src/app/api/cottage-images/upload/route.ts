import { type HandleUploadBody, handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import {
  assertCanUploadCottageImages,
  isCottageImageUploadAuthError,
} from '@/lib/cottage/upload-auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const user = await assertCanUploadCottageImages(request);

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (isCottageImageUploadAuthError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
