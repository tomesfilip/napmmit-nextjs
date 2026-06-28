import type { User } from 'lucia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/server/db/drizzle';
import { cottageOwnershipFilter, getCottageIfOwned } from './ownership';

vi.mock('@/server/db/drizzle', () => ({
  default: {
    query: {
      cottages: {
        findFirst: vi.fn(),
      },
    },
  },
}));

const mockFindFirst = vi.mocked(db.query.cottages.findFirst);

function mockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user_owner',
    role: 'cottage_owner',
    username: 'owner',
    email: 'owner@example.com',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  } as User;
}

const rawCottage = {
  id: 42,
  name: 'Alpine Hut',
  userId: 'user_owner',
  cottageServices: [
    {
      service: { id: 1, name: 'WiFi', icon: 'wifi' },
    },
  ],
  images: [{ id: 1, src: '/img.jpg', width: 100, height: 100, order: 0 }],
};

describe('cottageOwnershipFilter', () => {
  it('scopes non-admin users to their own cottage', () => {
    const filter = cottageOwnershipFilter(42, mockUser());
    expect(filter).toBeDefined();
  });

  it('allows admins to access any cottage id', () => {
    const filter = cottageOwnershipFilter(
      42,
      mockUser({ id: 'admin_1', role: 'admin' }),
    );
    expect(filter).toBeDefined();
  });
});

describe('getCottageIfOwned', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cottage data for the owner', async () => {
    mockFindFirst.mockResolvedValue(rawCottage as never);

    const result = await getCottageIfOwned(42, mockUser());

    expect(result).toEqual({
      ...rawCottage,
      cottageServices: [{ id: 1, name: 'WiFi', icon: 'wifi' }],
      images: [{ id: 1, src: '/img.jpg', width: 100, height: 100, order: 0 }],
    });
    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.anything(),
      }),
    );
  });

  it('returns null when the cottage is not owned by the user', async () => {
    mockFindFirst.mockResolvedValue(undefined);

    await expect(
      getCottageIfOwned(42, mockUser({ id: 'other_user' })),
    ).resolves.toBeNull();
  });

  it('returns cottage data for admins regardless of owner', async () => {
    mockFindFirst.mockResolvedValue({
      ...rawCottage,
      userId: 'someone_else',
    } as never);

    const result = await getCottageIfOwned(
      42,
      mockUser({ id: 'admin_1', role: 'admin' }),
    );

    expect(result?.id).toBe(42);
  });

  it('returns null for unknown cottage ids', async () => {
    mockFindFirst.mockResolvedValue(undefined);

    await expect(getCottageIfOwned(999, mockUser())).resolves.toBeNull();
  });
});
