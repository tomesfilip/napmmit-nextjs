# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup
- Fixed reservation date handling to use date-only `yyyy-MM-dd` values instead of UTC `toISOString()` conversions, preventing one-day shifts across timezones; also removed duplicate/unused reservation code.
- Fixed reservation total price calculation to update when the guest count changes by including guests in the `nights × pricePerNight` calculation and display breakdown.
