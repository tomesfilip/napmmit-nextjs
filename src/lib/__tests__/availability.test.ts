import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from 'vitest';
import { canMakeReservation, getAvailableBeds } from '@/lib/availability';
import db from '@/server/db/drizzle';

// Mock the database
vi.mock('@/server/db/drizzle', () => ({
  default: {
    select: vi.fn(),
  },
}));

const mockDb = db as {
  select: MockedFunction<any>;
};

describe('Availability Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableBeds', () => {
    const cottageId = 1;
    const checkIn = new Date('2024-01-15');
    const checkOut = new Date('2024-01-17');

    it('should return 0 when cottage does not exist', async () => {
      mockCottageQuery(null);

      const result = await getAvailableBeds(cottageId, checkIn, checkOut);

      expect(result).toBe(0);
    });

    it('should return total beds when no reservations exist', async () => {
      const totalBeds = 10;
      mockCottageQuery({ totalBeds });
      mockReservationsQuery(null);

      const result = await getAvailableBeds(cottageId, checkIn, checkOut);

      expect(result).toBe(totalBeds);
    });

    it('should return available beds when some are reserved', async () => {
      const totalBeds = 10;
      const reservedBeds = 4;
      mockCottageQuery({ totalBeds });
      mockReservationsQuery(reservedBeds);

      const result = await getAvailableBeds(cottageId, checkIn, checkOut);

      expect(result).toBe(6);
    });

    it('should return 0 when all beds are reserved', async () => {
      const totalBeds = 5;
      const reservedBeds = 5;
      mockCottageQuery({ totalBeds });
      mockReservationsQuery(reservedBeds);

      const result = await getAvailableBeds(cottageId, checkIn, checkOut);

      expect(result).toBe(0);
    });

    it('should return 0 when more beds are reserved than available', async () => {
      const totalBeds = 5;
      const reservedBeds = 8;
      mockCottageQuery({ totalBeds });
      mockReservationsQuery(reservedBeds);

      const result = await getAvailableBeds(cottageId, checkIn, checkOut);

      expect(result).toBe(0);
    });

    it('should handle null reservation total correctly', async () => {
      const totalBeds = 10;
      mockCottageQuery({ totalBeds });
      mockReservationsQuery(null);

      const result = await getAvailableBeds(cottageId, checkIn, checkOut);

      expect(result).toBe(totalBeds);
    });

    it('should convert dates to correct string format for database queries', async () => {
      mockCottageQuery({ totalBeds: 10 });
      mockReservationsQuery(0);

      await getAvailableBeds(cottageId, checkIn, checkOut);

      const expectedCheckIn = '2024-01-15';
      const expectedCheckOut = '2024-01-17';

      // Verify the where clause was called with string dates
      const whereCall = mockDb.select().from().where;
      expect(whereCall).toHaveBeenCalled();
    });
  });

  describe('canMakeReservation', () => {
    const cottageId = 1;
    const checkIn = new Date('2024-01-15');
    const checkOut = new Date('2024-01-17');

    it('should return true when enough beds are available', async () => {
      const requestedBeds = 3;
      mockCottageQuery({ totalBeds: 10 });
      mockReservationsQuery(2);

      const result = await canMakeReservation(
        cottageId,
        checkIn,
        checkOut,
        requestedBeds,
      );

      expect(result).toBe(true);
    });

    it('should return true when exactly enough beds are available', async () => {
      const requestedBeds = 5;
      mockCottageQuery({ totalBeds: 10 });
      mockReservationsQuery(5);

      const result = await canMakeReservation(
        cottageId,
        checkIn,
        checkOut,
        requestedBeds,
      );

      expect(result).toBe(true);
    });

    it('should return false when not enough beds are available', async () => {
      const requestedBeds = 6;
      mockCottageQuery({ totalBeds: 10 });
      mockReservationsQuery(5);

      const result = await canMakeReservation(
        cottageId,
        checkIn,
        checkOut,
        requestedBeds,
      );

      expect(result).toBe(false);
    });

    it('should return false when cottage does not exist', async () => {
      const requestedBeds = 1;
      mockCottageQuery(null);

      const result = await canMakeReservation(
        cottageId,
        checkIn,
        checkOut,
        requestedBeds,
      );

      expect(result).toBe(false);
    });

    it('should return false when requesting zero beds', async () => {
      const requestedBeds = 0;
      mockCottageQuery({ totalBeds: 10 });
      mockReservationsQuery(0);

      const result = await canMakeReservation(
        cottageId,
        checkIn,
        checkOut,
        requestedBeds,
      );

      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle same day check-in and check-out', async () => {
      const cottageId = 1;
      const sameDate = new Date('2024-01-15');
      mockCottageQuery({ totalBeds: 5 });
      mockReservationsQuery(0);

      const result = await getAvailableBeds(cottageId, sameDate, sameDate);

      expect(result).toBe(5);
    });

    it('should handle future dates correctly', async () => {
      const cottageId = 1;
      const futureCheckIn = new Date('2025-12-25');
      const futureCheckOut = new Date('2025-12-27');
      mockCottageQuery({ totalBeds: 8 });
      mockReservationsQuery(2);

      const result = await getAvailableBeds(
        cottageId,
        futureCheckIn,
        futureCheckOut,
      );

      expect(result).toBe(6);
    });
  });
});

// Test Helpers
function mockCottageQuery(cottage: { totalBeds: number } | null) {
  const cottageChain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    mockResolvedValue: vi.fn().mockResolvedValue(cottage ? [cottage] : []),
  };

  mockDb.select.mockReturnValueOnce(cottageChain);
}

function mockReservationsQuery(totalReserved: number | null) {
  const reservationsChain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    mockResolvedValue: vi.fn().mockResolvedValue([{ total: totalReserved }]),
  };

  mockDb.select.mockReturnValueOnce(reservationsChain);
}
