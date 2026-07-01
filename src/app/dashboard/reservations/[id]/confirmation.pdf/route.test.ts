import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockValidateRequest: vi.fn(),
  mockGetSummaryById: vi.fn(),
  mockBuildPdfResponse: vi.fn(),
}));

vi.mock('@/lib/auth/validateRequest', () => ({
  validateRequest: mocks.mockValidateRequest,
}));

vi.mock('@/lib/reservation/summary', () => ({
  getReservationConfirmationSummaryById: mocks.mockGetSummaryById,
}));

vi.mock('@/lib/pdf/build-pdf-response', () => ({
  buildReservationConfirmationPdfResponse: mocks.mockBuildPdfResponse,
}));

import { GET } from './route';

describe('dashboard confirmation.pdf route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockBuildPdfResponse.mockResolvedValue(
      new Response('pdf', { status: 200 }),
    );
  });

  it('returns 404 when user is not authenticated', async () => {
    mocks.mockValidateRequest.mockResolvedValue({ user: null, session: null });

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '12' }),
    });

    expect(response.status).toBe(404);
    expect(mocks.mockGetSummaryById).not.toHaveBeenCalled();
  });

  it('returns 404 for invalid reservation id', async () => {
    mocks.mockValidateRequest.mockResolvedValue({
      user: { id: 'user_1' },
      session: {},
    });

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'abc' }),
    });

    expect(response.status).toBe(404);
    expect(mocks.mockGetSummaryById).not.toHaveBeenCalled();
  });

  it('returns 404 when reservation is not owned by user', async () => {
    mocks.mockValidateRequest.mockResolvedValue({
      user: { id: 'user_1' },
      session: {},
    });
    mocks.mockGetSummaryById.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '12' }),
    });

    expect(response.status).toBe(404);
    expect(mocks.mockGetSummaryById).toHaveBeenCalledWith(12, 'user_1');
  });

  it('returns pdf response for owned reservation', async () => {
    const summary = { id: 12 };
    mocks.mockValidateRequest.mockResolvedValue({
      user: { id: 'user_1' },
      session: {},
    });
    mocks.mockGetSummaryById.mockResolvedValue(summary);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '12' }),
    });

    expect(response.status).toBe(200);
    expect(mocks.mockBuildPdfResponse).toHaveBeenCalledWith(summary);
  });
});
