import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockRetrieve: vi.fn(),
  mockCreatePaidReservation: vi.fn(),
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

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: mocks.mockRetrieve,
      },
    },
    refunds: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/reservation/actions', () => ({
  createPaidReservation: mocks.mockCreatePaidReservation,
}));

import { fulfillPaidCheckoutSession } from './fulfill-checkout-session';

describe('fulfillPaidCheckoutSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFindFirst.mockResolvedValue(null);
    mocks.mockCreatePaidReservation.mockResolvedValue({
      success: true,
      reservationId: 99,
    });
  });

  it('returns early when reservation already exists', async () => {
    mocks.mockFindFirst.mockResolvedValue({ id: 42 });

    const result = await fulfillPaidCheckoutSession('cs_test_existing');

    expect(result).toEqual({ success: true, created: false });
    expect(mocks.mockRetrieve).not.toHaveBeenCalled();
  });

  it('creates reservation from a paid Stripe checkout session', async () => {
    mocks.mockRetrieve.mockResolvedValue({
      id: 'cs_test_paid',
      status: 'complete',
      payment_status: 'paid',
      created: 1_700_000_000,
      payment_intent: 'pi_123',
      metadata: {
        cottageId: '3',
        from: '2026-07-08',
        to: '2026-07-09',
        bedsReserved: '1',
        totalPrice: '40',
        guestEmail: 'guest@example.com',
      },
    });

    const result = await fulfillPaidCheckoutSession('cs_test_paid');

    expect(result).toEqual({ success: true, created: true });
    expect(mocks.mockCreatePaidReservation).toHaveBeenCalledWith(
      expect.objectContaining({
        cottageId: 3,
        bedsReserved: 1,
        guestEmail: 'guest@example.com',
      }),
      expect.objectContaining({
        stripeCheckoutSessionId: 'cs_test_paid',
        stripePaymentIntentId: 'pi_123',
      }),
    );
  });

  it('does not create reservation when checkout session is unpaid', async () => {
    mocks.mockRetrieve.mockResolvedValue({
      id: 'cs_test_open',
      status: 'open',
      payment_status: 'unpaid',
      metadata: {},
    });

    const result = await fulfillPaidCheckoutSession('cs_test_open');

    expect(result).toEqual({ error: 'checkout_session_not_paid' });
    expect(mocks.mockCreatePaidReservation).not.toHaveBeenCalled();
  });
});
