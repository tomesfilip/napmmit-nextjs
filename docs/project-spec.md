## Nappmit project specification
Centralized platform for all mountain cottages for hikers and cottage owners in Slovakia (later in other countries as well).

## Problem (Core Idea)
Hikers in Slovakia don't have a centralized platform to make a reservation for their mountain cottage. They need to:
- find what cottages are on their route
- find out their website
- make a reservation through the website or make a reservation via email or phone

Owners also have plenty of things to do. Now they need to:
- answer emails and pay attention to their details
- write everything down in a physical reservation book

This creates friction during the reservation process and makes the process time-consuming. Napmmit provides ONE fast, searchable, mountain cottage hub for all hikers and cottage managers (owners).


## Users
- **Hikers**:
  Need a fast way to find and reserve a sleeping place in a mountain cottage

- **Owners**:
  Need a reliable system for managing their mountain cottage reservations

- **Admins**:

Admins can:
- manage users
- remove cottages
- moderate inappropriate content
- manage reservations if needed

## Features
Here is a list of features for Napmmit.

A. **Cottages**
Owners will be able to create cottages with a help of multi-step creation form. Cottage has:
- images (gallery)
- name/title
- description
- address
- mountain area
- bed capacity
- base price per night
- optional low season price per night
- optional breakfast and dinner prices
- phone number
- email
- website
- map/location URL
- services/amenities
- unavailable dates
- owner relation
- created/updated timestamps

B. **Reservations**

- Hikers can book a cottage and by this action they create a reservation. 
- Owners can see all of the reservations of their cottage in their dashboard. 
- Hikers will get a confirmation email after reservation is successful. And they can also see the reservations dashboard.
- more info here: docs/reservations.md

**Reservation Lifecycle**

Reservation statuses:
- pending
- confirmed
- cancelled
- completed

Flow:
1. Hiker selects dates and beds
2. Availability is checked
3. Hiker pays reservation fee (€1)
4. Reservation is created as `pending`
5. Cottage owner confirms reservation
6. Reservation becomes `confirmed`
7. After stay ends, reservation becomes `completed`

Cancellation:
- Hiker can cancel only 48h before reservation start
- Refund amount is €0.50
- Cancellation updates availability automatically


C. **Search**
Powerful search across:
- cottage name
- mountain area
- services/amenities

D. **Authentication**
 
- Email/password first.
- User roles: hiker, cottage owner, admin.
- Signup currently supports hiker and cottage owner roles.
- Google/Gmail sign-in can be added later if useful.

E. **Other Features**

- upload images
- delete account
- calendar view of reservations


## Data
This is a rough representation of the current data model. It can evolve, but it should stay aligned with `src/server/db/schema.ts`.

**USER**

- id
- email
- password
- username
- phoneNumber
- role (hiker | cottage_owner | admin)
- isEmailVerified
- createdAt
- updatedAt
- relations: cottages, reservations

**COTTAGE**

- id
- name
- description
- address
- mountainArea
- totalBeds
- pricePerNight
- priceLowPerNight
- priceBreakfast
- priceDinner
- phoneNumber
- email
- website
- locationURL
- unAvailabilityDates
- userId (owner)
- createdAt
- updatedAt
- relations: owner, reservations, services, images

**RESERVATION**

- id
- userId (optional, for logged-in hikers)
- cottageId
- guestEmail
- guestPhone
- bedsReserved
- reservationFee
- refundAmount
- pricePerNight
- totalPrice
- from
- to
- status (pending | confirmed | cancelled | completed)
- accessToken
- createdAt
- updatedAt
- relations: user, cottage, reservationDays

**RESERVATION DAY**

- id
- reservationId
- date
- bedsReserved
- createdAt
- updatedAt

This table supports day-by-day availability checks and avoids overbooking across overlapping date ranges.

**SERVICE**

- id
- name
- icon

**COTTAGE SERVICE**

- cottageId
- serviceId

Join table between cottages and services.

**IMAGE**

- id
- cottageId
- src
- width
- height
- order
- createdAt

**AUTH SUPPORT TABLES**

- sessions
- emailVerificationCodes
- passwordResetTokens

## Tech Stack

- Framework: Next.js 16 / React 19
- Language: TypeScript
- Runtime/package manager: Bun
- Styling: Tailwind CSS 3, Tailwind animations, class-variance-authority, clsx, tailwind-merge
- UI primitives/components: Radix UI, lucide-react, react-icons, shadcn-style local components
- Forms and validation: react-hook-form, Zod, @hookform/resolvers
- Database: PostgreSQL, Neon serverless driver
- ORM/schema: Drizzle ORM and Drizzle Kit
- Authentication: Lucia with Drizzle adapter, email/password, Argon2/Bcrypt password hashing
- Internationalization: next-intl
- Client data fetching/caching: TanStack React Query
- Dates/calendar: date-fns, react-day-picker
- File/image uploads: Vercel Blob, react-dropzone (maybe consider "Cloudinary" in future)
- Payments: Stripe
- Emails: React Email and Resend
- Toasts/feedback: Sonner
- Formatting/linting: Biome, Next lint

## Monetization

We will work on reservation system.

When hiker clicks on "reserve" button with already selected guests and dates. Confirmation modal is shown. Through this modal, he pays the reservation fee.
If the reservation was cancelled, the reservation fee is returned.

**Payment Flow**

Napmmit currently charges only a reservation fee (€1).

The full accommodation payment is handled directly between the hiker and the cottage owner.

Stripe is used for:
- reservation fee payment
- partial refunds (€0.50)

Future versions may support full online payments.

## UI/UX

**General**
- Modern, minimal, hikers focused
- light mode by default (dark mode optional)
- Clean typography (fonts already selected), proper whitespace
- Subtle borders and shadows
- Reference: https://www.airbnb.com/, https://www.helm.yt/, https://www.roroshotellene.no/

**Layout**
- Sidebar + main content (collapsible sidebar)
- Sidebar: quick filters when on main page (cottage list), navigation menu of cottage owner (reservations, calendar, cottages) (on mobile, the sidebar disappears and only one fixed filter button is visible - the filter button opens the filter modal)
- Main: Grid of cottage cards with a glass design small pieces of information (location, cottage name), the background of the card is the cottage image
- individual cards open detail page of a cottage
- Detail page layout:
  - mobile gallery first
  - title and description section
  - desktop image gallery
  - reservation card with date range picker, guest count, availability status, contact fields for anonymous hikers, and total price
  - contact card with cottage contact details
  - location/map section


**Type Colors & Icons**
- Text: #0a0a0a
- Buttons: #f1f5f9
- Background: #ffffff
- Some other backgrounds: #f1f1f1
- Theme can evolve later, but the current priority is reservation logic, availability, and owner/hiker flows.

**Responsive**
- Desktop-first but mobile usable
- Sidebar becomes modal on mobile

**Micro-interactions:**

- Smooth transitions
- Hover states on cards
- Toast notifications for actions
- Loading skeletons


## Security

- Passwords are hashed securely
- Email verification is required
- Reservation actions are validated server-side
- Availability checks prevent overbooking
- Rate limiting may be added for abuse prevention

## SEO

Public cottage pages should be optimized for search engines:
- dynamic metadata
- Open Graph images
- structured data
- semantic HTML
- sitemap generation


## Future Features

Possible future features:
- full online payments
- reviews and ratings
- hiking route integration
- weather integration
- multilingual support for additional countries
- owner analytics
- saved/favorite cottages

## Platform Responsibility

Napmmit acts as an intermediary platform between hikers and cottage owners.
Accommodation services are provided directly by cottage owners.

## Monitoring (planned)

- Error tracking
- Reservation event logging
- Email delivery monitoring
- Sentry