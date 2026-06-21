import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getReservationConfirmationSummaryById } from './summary-queries';

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

const reservationSource = {
  id: 42,
  accessToken: 'access-token-123',
  status: 'pending',
  paymentStatus: 'paid' as const,
  from: '2026-07-01',
  to: '2026-07-03',
  bedsReserved: 2,
  pricePerNight: 25,
  totalPrice: 100,
  reservationFeeCents: 100,
  userId: 'user-123',
  guestEmail: null,
  guestPhone: null,
  cottage: {
    id: 1,
    name: 'Test Cottage',
    address: 'Test Address',
    email: 'cottage@example.com',
    phoneNumber: '+421900000000',
    website: 'https://example.com',
  },
  user: {
    username: 'Hiker',
    email: 'hiker@example.com',
    phoneNumber: '+421911111111',
  },
};

describe('getReservationConfirmationSummaryById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns summary for owning hiker', async () => {
    mocks.mockFindFirst.mockResolvedValue(reservationSource);

    const summary = await getReservationConfirmationSummaryById(42, 'user-123');

    expect(summary).toMatchObject({
      id: 42,
      status: 'pending',
      cottage: { name: 'Test Cottage' },
      guest: {
        name: 'Hiker',
        email: 'hiker@example.com',
        isLoggedIn: true,
      },
    });
    expect(mocks.mockFindFirst).toHaveBeenCalledOnce();
  });

  it('returns null for non-existent reservation', async () => {
    mocks.mockFindFirst.mockResolvedValue(null);

    await expect(
      getReservationConfirmationSummaryById(999, 'user-123'),
    ).resolves.toBeNull();
  });

  it('returns null when reservation belongs to another user', async () => {
    mocks.mockFindFirst.mockResolvedValue(null);

    await expect(
      getReservationConfirmationSummaryById(42, 'other-user'),
    ).resolves.toBeNull();
  });
});
