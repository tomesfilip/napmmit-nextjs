# Bed Availability System Implementation Guide

## Overview
This system ensures that cottage beds are properly managed across date ranges, preventing overbooking and providing real-time availability checking.

## Files to Replace

### 1. Replace the cottage detail page
```bash
mv src/app/cottage/[id]/page-updated.tsx src/app/cottage/[id]/page.tsx
```

### 2. Replace the reservation section component
```bash
mv src/components/cottageDetail/reservation-section-updated.tsx src/components/cottageDetail/reservation-section.tsx
```

### 3. Replace the reservation actions
```bash
mv src/lib/reservation/actions-updated.ts src/lib/reservation/actions.ts
```

## Key Features Implemented

### 1. Dynamic Availability Calculation (`availability.ts`)
- `getAvailableBeds(cottageId, checkIn, checkOut)`: Calculates available beds for date range
- `canMakeReservation(cottageId, checkIn, checkOut, requestedBeds)`: Validates if reservation is possible
- Handles date overlaps correctly using proper SQL queries
- Converts Date objects to strings for database compatibility

### 2. Enhanced Cottage Detail Page
- Uses availability service to show current bed availability
- Passes real-time availability data to reservation component
- Handles errors gracefully with fallback to total beds

### 3. Real-time Reservation Section
- Checks availability when user selects dates
- Shows loading state during availability checks
- Updates available bed count dynamically
- Prevents reservations when beds aren't available
- Enhanced error handling for availability issues

### 4. Improved Reservation Actions
- Uses `canMakeReservation()` before creating reservations
- Eliminates race conditions in booking process
- Better error messages for availability issues
- Maintains data consistency

## Database Schema
Your current schema already supports this system:
- `cottages.totalBeds`: Total beds per cottage
- `reservations.bedsReserved`: Beds reserved per booking
- `reservations.from/to`: Date range for reservations
- `reservations.status`: Reservation status (pending/confirmed/cancelled)

## How It Works

1. **Availability Calculation**: 
   - Takes cottage's total beds
   - Subtracts beds reserved in overlapping date ranges
   - Only counts confirmed/pending reservations
   - Returns available beds for the specific date range

2. **Real-time Updates**:
   - When user selects dates, system checks availability
   - Shows exact number of available beds
   - Updates guest input limits accordingly
   - Prevents invalid reservations

3. **Reservation Validation**:
   - Before creating reservation, validates availability
   - Prevents overbooking through race conditions
   - Provides clear error messages

## Error Handling
- `beds_not_available`: Not enough beds for selected dates
- `beds_required`: Invalid bed count
- `dates_unavailable`: Dates are blocked
- Graceful fallbacks when availability service fails

## Testing
Comprehensive tests are included in `src/lib/__tests__/availability.test.ts` covering:
- Normal availability scenarios
- Edge cases (same dates, future dates)
- Error conditions (non-existent cottage)
- Boundary conditions (zero beds, exact matches)

## Usage Example
```typescript
// Check if 3 beds are available from Jan 15-17
const available = await canMakeReservation(
  cottageId, 
  new Date('2024-01-15'), 
  new Date('2024-01-17'), 
  3
);

if (available) {
  // Proceed with reservation
} else {
  // Show error message
}
```

This system ensures reliable bed availability management while providing a smooth user experience with real-time feedback.