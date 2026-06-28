import type { User } from 'lucia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateRequest } from '@/lib/auth/validateRequest';
import db from '@/server/db/drizzle';
import { createCottage, deleteCottage, updateCottage } from './actions';

vi.mock('@/lib/auth/validateRequest', () => ({
  validateRequest: vi.fn(),
}));

vi.mock('@/server/db/drizzle', () => ({
  default: {
    update: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
  },
}));

const mockValidateRequest = vi.mocked(validateRequest);
const mockUpdate = vi.mocked(db.update);
const mockInsert = vi.mocked(db.insert);
const mockDelete = vi.mocked(db.delete);
const mockSelect = vi.mocked(db.select);

let mockUpdateReturning: ReturnType<typeof vi.fn>;
let mockUpdateSet: ReturnType<typeof vi.fn>;
let mockInsertReturning: ReturnType<typeof vi.fn>;
let mockInsertValues: ReturnType<typeof vi.fn>;
let mockDeleteWhere: ReturnType<typeof vi.fn>;
let mockSelectLimit: ReturnType<typeof vi.fn>;

function setupUpdateChain(returning: unknown[] = [{ id: 42 }]) {
  mockUpdateReturning = vi.fn().mockResolvedValue(returning);
  const mockUpdateWhere = vi.fn().mockReturnValue({
    returning: mockUpdateReturning,
  });
  mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
  mockUpdate.mockReturnValue({ set: mockUpdateSet } as never);
}

function setupInsertChain(returning: unknown[] = [{ id: 7 }]) {
  mockInsertReturning = vi.fn().mockResolvedValue(returning);
  mockInsertValues = vi.fn().mockReturnValue({
    returning: mockInsertReturning,
  });
  mockInsert.mockReturnValue({ values: mockInsertValues } as never);
}

function setupDeleteChain() {
  mockDeleteWhere = vi.fn().mockResolvedValue(undefined);
  mockDelete.mockReturnValue({ where: mockDeleteWhere } as never);
}

function setupSelectChain(rows: unknown[] = [{ id: 42 }]) {
  mockSelectLimit = vi.fn().mockResolvedValue(rows);
  const mockSelectWhere = vi.fn().mockReturnValue(
    Object.assign(Promise.resolve([]), {
      limit: mockSelectLimit,
    }),
  );
  const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere });
  mockSelect.mockReturnValue({ from: mockSelectFrom } as never);
}

const validCottageInput = {
  title: 'Test Cottage',
  description: 'A nice place',
  address: '123 Mountain Rd',
  mountainArea: 'High Tatras',
  totalBeds: 4,
  pricePerNight: 50,
};

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

function mockSession(user: User) {
  return {
    user,
    session: {
      id: 'session_1',
      userId: user.id,
      fresh: false,
      expiresAt: new Date(),
    },
  };
}

describe('updateCottage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateRequest.mockResolvedValue(mockSession(mockUser()));
    setupUpdateChain();
  });

  it('requires cottageId', async () => {
    await expect(updateCottage(validCottageInput)).rejects.toThrow(
      'Cottage ID is required',
    );
  });

  it('rejects unauthenticated users', async () => {
    mockValidateRequest.mockResolvedValue({ user: null, session: null });

    await expect(
      updateCottage({ ...validCottageInput, cottageId: 42 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('rejects updates when ownership filter matches no row', async () => {
    setupUpdateChain([]);

    await expect(
      updateCottage({ ...validCottageInput, cottageId: 42 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates owned cottage and omits userId from the payload', async () => {
    const cottageId = await updateCottage({
      ...validCottageInput,
      cottageId: 42,
    });

    expect(cottageId).toBe(42);
    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.not.objectContaining({ userId: expect.anything() }),
    );
    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test Cottage' }),
    );
  });

  it('allows admins to update cottages they do not own', async () => {
    mockValidateRequest.mockResolvedValue(
      mockSession(mockUser({ id: 'admin_1', role: 'admin' })),
    );

    await expect(
      updateCottage({ ...validCottageInput, cottageId: 99 }),
    ).resolves.toBe(99);
  });

  it('validates required fields', async () => {
    await expect(
      updateCottage({
        ...validCottageInput,
        cottageId: 42,
        title: '   ',
      }),
    ).rejects.toThrow('Title is required');
  });
});

describe('createCottage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateRequest.mockResolvedValue(mockSession(mockUser()));
    setupInsertChain();
  });

  it('rejects unauthenticated users', async () => {
    mockValidateRequest.mockResolvedValue({ user: null, session: null });

    await expect(createCottage(validCottageInput)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('creates cottage with the authenticated user as owner', async () => {
    const cottageId = await createCottage(validCottageInput);

    expect(cottageId).toBe(7);
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user_owner', name: 'Test Cottage' }),
    );
  });

  it('throws when insert returns no row', async () => {
    setupInsertChain([]);

    await expect(createCottage(validCottageInput)).rejects.toThrow(
      'Failed to create cottage',
    );
  });
});

describe('deleteCottage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateRequest.mockResolvedValue(mockSession(mockUser()));
    setupSelectChain();
    setupDeleteChain();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('rejects unauthenticated users', async () => {
    mockValidateRequest.mockResolvedValue({ user: null, session: null });

    await expect(deleteCottage(42)).rejects.toThrow('Unauthorized');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('rejects deletes when ownership filter matches no row', async () => {
    setupSelectChain([]);

    await expect(deleteCottage(42)).rejects.toThrow('Unauthorized');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('deletes related records for an owned cottage', async () => {
    await expect(deleteCottage(42)).resolves.toEqual({ success: true });
    expect(mockDelete).toHaveBeenCalledTimes(4);
    expect(mockDeleteWhere).toHaveBeenCalledTimes(4);
  });

  it('allows admins to delete cottages they do not own', async () => {
    mockValidateRequest.mockResolvedValue(
      mockSession(mockUser({ id: 'admin_1', role: 'admin' })),
    );

    await expect(deleteCottage(99)).resolves.toEqual({ success: true });
  });
});
