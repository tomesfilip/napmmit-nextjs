import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resolveConfirmationEmailRecipient,
  sendReservationConfirmationEmailOnce,
} from './confirmation';

const mockFindFirst = vi.fn();
const mockUpdate = vi.fn(() => ({
  set: vi.fn(() => ({
    where: vi.fn(),
  })),
}));
const mockSendMail = vi.fn();

vi.mock('@/server/db/drizzle', () => ({
  default: {
    query: {
      reservations: {
        findFirst: (...args: unknown[]) => mockFindFirst(...args),
      },
    },
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

vi.mock('@/server/db/sendMail', () => ({
  sendMail: (...args: unknown[]) => mockSendMail(...args),
}));

vi.mock('@/lib/emailTemplates/reservation-created', () => ({
  renderReservationCreatedEmail: vi.fn(async () => '<p>email</p>'),
}));

const baseReservation = {
  id: 42,
  confirmationEmailSentAt: null,
  userId: null,
  guestEmail: 'guest@example.com',
  guestPhone: null,
  accessToken: 'token-abc',
  status: 'pending',
  paymentStatus: 'paid' as const,
  from: '2024-07-15',
  to: '2024-07-16',
  bedsReserved: 2,
  pricePerNight: 30,
  totalPrice: 60,
  reservationFeeCents: 100,
  cottage: {
    id: 1,
    name: 'Chata',
    address: 'Tatry',
    email: null,
    phoneNumber: null,
    website: null,
  },
  user: null,
};

describe('resolveConfirmationEmailRecipient', () => {
  it('uses logged-in hiker email', () => {
    expect(
      resolveConfirmationEmailRecipient({
        userId: 'user_1',
        guestEmail: null,
        guestPhone: null,
        user: {
          username: 'Jana',
          email: 'jana@example.com',
          phoneNumber: '+421900000001',
        },
      }),
    ).toBe('jana@example.com');
  });

  it('uses anonymous hiker guestEmail', () => {
    expect(
      resolveConfirmationEmailRecipient({
        userId: null,
        guestEmail: 'guest@example.com',
        guestPhone: '+421911111111',
        user: null,
      }),
    ).toBe('guest@example.com');
  });

  it('returns null for phone-only anonymous reservation', () => {
    expect(
      resolveConfirmationEmailRecipient({
        userId: null,
        guestEmail: null,
        guestPhone: '+421911111111',
        user: null,
      }),
    ).toBeNull();
  });
});

describe('sendReservationConfirmationEmailOnce', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendMail.mockResolvedValue({ data: { id: 'msg_123' }, error: null });
  });

  it('does not send when confirmationEmailSentAt is already set', async () => {
    mockFindFirst.mockResolvedValue({
      ...baseReservation,
      confirmationEmailSentAt: new Date('2024-01-01'),
    });

    const result = await sendReservationConfirmationEmailOnce(42);

    expect(result).toEqual({ success: true });
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('marks sent after successful Resend response', async () => {
    mockFindFirst.mockResolvedValue(baseReservation);

    const result = await sendReservationConfirmationEmailOnce(42);

    expect(result).toEqual({ success: true });
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'guest@example.com' }),
    );
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('marks failed and returns error on send failure', async () => {
    mockFindFirst.mockResolvedValue(baseReservation);
    mockSendMail.mockResolvedValue({
      data: null,
      error: { message: 'send failed' },
    });

    const result = await sendReservationConfirmationEmailOnce(42);

    expect(result).toEqual({ error: 'confirmation_email_failed' });
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('skips email for phone-only anonymous reservation', async () => {
    mockFindFirst.mockResolvedValue({
      ...baseReservation,
      guestEmail: null,
      guestPhone: '+421911111111',
    });

    const result = await sendReservationConfirmationEmailOnce(42);

    expect(result).toEqual({ success: true });
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });
});
