import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getReservationPaymentStatus } from './payment-status';

const mocks = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('@/server/db/drizzle', () => ({
  default: {
    query: {
      reservations: {
        findFirst: mocks.mockFindFirst,
      },
    },
  },
}));

describe('getReservationPaymentStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns missing_session when checkout session id is absent', async () => {
    await expect(getReservationPaymentStatus(undefined)).resolves.toEqual({
      status: 'missing_session',
    });
    expect(mocks.mockFindFirst).not.toHaveBeenCalled();
  });

  it('returns not_found when reservation does not exist yet', async () => {
    mocks.mockFindFirst.mockResolvedValue(null);

    await expect(getReservationPaymentStatus('cs_test_123')).resolves.toEqual({
      status: 'not_found',
    });
    expect(mocks.mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: expect.objectContaining({
          accessToken: true,
          id: true,
          paymentStatus: true,
          status: true,
        }),
      }),
    );
  });

  it('returns reservation metadata when reservation exists', async () => {
    mocks.mockFindFirst.mockResolvedValue({
      id: 42,
      status: 'pending',
      paymentStatus: 'paid',
      accessToken: 'access-token-123',
    });

    await expect(getReservationPaymentStatus('cs_test_123')).resolves.toEqual({
      status: 'reservation_created',
      reservationId: 42,
      reservationStatus: 'pending',
      paymentStatus: 'paid',
      accessToken: 'access-token-123',
    });
  });
});
