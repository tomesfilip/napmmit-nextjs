# Reservations
Reservations documentation. How should object of the reservation look like, how it should behave from the perspective of both user types (hiker/owner).

## Reservation object definition


## Reservation flow from hiker's perspective
1. Hiker selects a cottage from listing page
2. Hiker inputs his email/phone if he's not logged in
3. Hiker selects dates and number of guests
4. Hiker confirms the reservation

## Reservation flow from owner's perspecive
1. Owner can see it in the dashboard (along with all other reservations for his cottage) - when reservation was successfully made
2. Owner can cancel the reservation
3. Owner can confirm the reservation

## Reservation flow from system's perspective
1. When reservation is submitted, system validates data (email/phone), valid date range and if there's enough space to accommodate the amount of inputted guests for this date range
2.  - Invalid: system sends an appropriate message to a user in a UX friendly way
    - Valid: system shows a payment gate modal (stripe integration) and waits until user submits payment
3.  - Invalid: system shows an appropriate message to a user that payment was not made  
    - Payment successful: System creates a reservation (saves it in the database) with a state: pending (waits for confirmation, when not confirmed in 48 hours, it's automatically cancelled)
4. System sends a confirmation email to the user that reservation was made


## UX
1. Hiker can see which dates are available for the selected number of guests in the calendar.
2. Hiker is able to select from and to dates easily (two separate fields might work better than just one)
