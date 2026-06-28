import type { User } from 'lucia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateRequestFromRequest } from '@/lib/auth/validateRequest';
import {
  assertCanUploadCottageImages,
  CottageImageUploadAuthError,
  isCottageImageUploadAuthError,
} from './upload-auth';

vi.mock('@/lib/auth/validateRequest', () => ({
  validateRequestFromRequest: vi.fn(),
}));

const mockValidateRequestFromRequest = vi.mocked(validateRequestFromRequest);

function mockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user_1',
    role: 'cottage_owner',
    username: 'owner',
    email: 'owner@example.com',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  } as User;
}

function mockSession(user: User, fresh = false) {
  return {
    user,
    session: {
      id: 'session_1',
      userId: user.id,
      fresh,
      expiresAt: new Date(),
    },
  };
}

const blankSessionCookie = {
  name: 'session',
  value: '',
  attributes: { path: '/' },
};

const request = new Request('https://example.com/api/cottage-images/upload');

describe('assertCanUploadCottageImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests with 401', async () => {
    mockValidateRequestFromRequest.mockResolvedValue({
      result: { user: null, session: null },
      sessionCookie: blankSessionCookie,
    });

    await expect(assertCanUploadCottageImages(request)).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized',
      sessionCookie: blankSessionCookie,
    });
  });

  it('rejects hikers with 403', async () => {
    mockValidateRequestFromRequest.mockResolvedValue({
      result: mockSession(mockUser({ role: 'hiker' })),
    });

    await expect(assertCanUploadCottageImages(request)).rejects.toMatchObject({
      status: 403,
      message: 'Forbidden',
    });
  });

  it('allows cottage owners', async () => {
    const user = mockUser({ role: 'cottage_owner' });
    mockValidateRequestFromRequest.mockResolvedValue({
      result: mockSession(user),
    });

    await expect(assertCanUploadCottageImages(request)).resolves.toEqual({
      user,
      sessionCookie: undefined,
    });
  });

  it('allows admins', async () => {
    const user = mockUser({ role: 'admin' });
    mockValidateRequestFromRequest.mockResolvedValue({
      result: mockSession(user),
    });

    await expect(assertCanUploadCottageImages(request)).resolves.toEqual({
      user,
      sessionCookie: undefined,
    });
  });

  it('returns session cookie updates for fresh sessions', async () => {
    const user = mockUser({ role: 'cottage_owner' });
    const refreshedSessionCookie = {
      name: 'session',
      value: 'refreshed-session',
      attributes: { path: '/' },
    };

    mockValidateRequestFromRequest.mockResolvedValue({
      result: mockSession(user, true),
      sessionCookie: refreshedSessionCookie,
    });

    await expect(assertCanUploadCottageImages(request)).resolves.toEqual({
      user,
      sessionCookie: refreshedSessionCookie,
    });
  });
});

describe('isCottageImageUploadAuthError', () => {
  it('identifies upload auth errors', () => {
    expect(
      isCottageImageUploadAuthError(new CottageImageUploadAuthError(401)),
    ).toBe(true);
    expect(isCottageImageUploadAuthError(new Error('Unauthorized'))).toBe(
      false,
    );
  });
});
