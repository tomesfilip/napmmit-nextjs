import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetSummaryByAccessToken: vi.fn(),
  mockBuildPdfResponse: vi.fn(),
}));

vi.mock('@/lib/reservation/summary', () => ({
  getReservationConfirmationSummaryByAccessToken:
    mocks.mockGetSummaryByAccessToken,
}));

vi.mock('@/lib/pdf/build-pdf-response', () => ({
  buildReservationConfirmationPdfResponse: mocks.mockBuildPdfResponse,
}));

import { GET } from './route';

describe('public confirmation.pdf route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockBuildPdfResponse.mockResolvedValue(
      new Response('pdf', { status: 200 }),
    );
  });

  it('returns 404 for unknown access token', async () => {
    mocks.mockGetSummaryByAccessToken.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ accessToken: 'missing' }),
    });

    expect(response.status).toBe(404);
    expect(mocks.mockBuildPdfResponse).not.toHaveBeenCalled();
  });

  it('returns pdf response for known access token', async () => {
    const summary = { id: 1, accessToken: 'token-abc' };
    mocks.mockGetSummaryByAccessToken.mockResolvedValue(summary);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ accessToken: 'token-abc' }),
    });

    expect(response.status).toBe(200);
    expect(mocks.mockBuildPdfResponse).toHaveBeenCalledWith(summary);
  });
});
