# 🏔️ Napmmit — Project Overview

> Centralized reservation and mountain cottage management platform for hikers and cottage owners.

---

# Vision

Napmmit aims to become the primary reservation and management ecosystem for mountain cottages in Slovakia and eventually across Europe.

The platform simplifies:

* discovering mountain cottages
* checking availability
* making reservations
* managing bookings
* handling communication between hikers and owners

Napmmit replaces fragmented reservations done through:

* phone calls
* emails
* handwritten books
* outdated websites

with one modern, searchable, centralized platform.

---

# Core Problem

## Current Situation

### Hikers

Hikers currently need to:

1. Search manually for cottages on their route
2. Visit different websites
3. Contact owners via phone/email
4. Wait for responses
5. Hope beds are still available

### Cottage Owners

Owners currently need to:

1. Answer repetitive emails
2. Handle calls manually
3. Maintain paper reservation books
4. Track occupancy manually
5. Avoid accidental overbookings

---

# Solution

Napmmit provides:

✅ Centralized searchable cottage catalog
✅ Real-time availability
✅ Reservation management
✅ Reservation fee handling
✅ Availability tracking
✅ Owner dashboards
✅ Reservation lifecycle automation
✅ Scalable multi-country architecture

---

# User Roles

## 🥾 Hikers

Goals:

* Search cottages quickly
* Reserve beds easily
* Track reservations
* Receive confirmations

Features:

* Cottage search
* Availability checking
* Reservation management
* Reservation history
* Reservation cancellation

---

## 🏠 Cottage Owners

Goals:

* Manage reservations efficiently
* Prevent overbookings
* Manage cottage listings
* Track occupancy

Features:

* Cottage management
* Calendar dashboard
* Reservation dashboard
* Availability management
* Image uploads
* Reservation confirmation flow

---

## 🛡️ Admins

Responsibilities:

* Moderate content
* Manage users
* Remove inappropriate listings
* Assist with reservations
* Monitor platform integrity

---

# Product Architecture

```text
┌───────────────────────────────────────┐
│               Frontend                │
│     Next.js 16 + React 19 + TS       │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│                API Layer              │
│ Server Actions / Route Handlers       │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│              Business Logic           │
│ Reservations │ Availability │ Auth    │
└───────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐     ┌────────────────┐
│ PostgreSQL    │     │ External Svcs  │
│ + Drizzle ORM │     │ Stripe         │
│ + Neon        │     │ Resend         │
└───────────────┘     │ Vercel Blob    │
                      │ Sentry         │
                      └────────────────┘
```

---

# Reservation Lifecycle

```text
Select Dates & Beds
          │
          ▼
Check Availability
          │
          ▼
Pay €1 Reservation Fee
          │
          ▼
Create Reservation (pending)
          │
          ▼
Owner Confirms Reservation
          │
          ▼
Reservation → confirmed
          │
          ▼
Stay Ends
          │
          ▼
Reservation → completed
```

---

# Cancellation Flow

```text
Hiker Cancels Reservation
          │
          ▼
Check 48h Rule
          │
   ┌──────┴──────┐
   │             │
Allowed      Rejected
   │
   ▼
Refund €0.50
   │
   ▼
Release Availability
   │
   ▼
Reservation → cancelled
```

---

# Core Features

# A. Cottage Management

Each cottage contains:

* image gallery
* title/name
* description
* address
* mountain area
* bed capacity
* seasonal pricing
* meals pricing
* contact information
* services/amenities
* unavailable dates
* map location

## Suggested Future Additions

* GPS coordinates
* check-in/check-out times
* emergency contact
* rules/policies
* multilingual descriptions
* nearby hiking routes

---

# B. Reservations

## Reservation States

| Status    | Description                 |
| --------- | --------------------------- |
| pending   | Awaiting owner confirmation |
| confirmed | Approved reservation        |
| cancelled | Reservation cancelled       |
| completed | Reservation finished        |

## Important Business Rules

* Availability must be checked server-side
* Overlapping reservations are forbidden
* Cancellation allowed only 48h before start
* Reservation fee = €1
* Refund = €0.50
* Owners manually approve reservations

---

# C. Search System

Searchable by:

* cottage name
* mountain area
* amenities
* availability
* capacity

## Suggested Filters

* breakfast available
* dinner available
* pet friendly
* WiFi
* shower
* electricity
* accessibility
* nearby hiking routes

---

# D. Authentication

## Initial Auth Methods

* Email/password

## Future Auth

* Google OAuth

## Roles

| Role          | Permissions          |
| ------------- | -------------------- |
| hiker         | reservations         |
| cottage_owner | manage cottages      |
| admin         | full platform access |

---

# E. Additional Features

* image uploads
* reservation calendar
* account deletion
* reservation dashboards
* email notifications
* responsive design

---

# Database Design

# Entity Relationship Diagram

```text
USER
 ├── owns ───────► COTTAGE
 ├── creates ────► RESERVATION
 │
COTTAGE
 ├── has ────────► IMAGE
 ├── has ────────► RESERVATION
 ├── many-to-many ► SERVICE
 │
RESERVATION
 ├── has ────────► RESERVATION_DAY
 │
SERVICE
 └── many-to-many ► COTTAGE
```

---

# Drizzle Schema
see file: src/server/db/schema.ts

---

# Availability Strategy

## Why Reservation Days Exist

The `reservation_days` table enables:

* fast daily availability checks
* overlap prevention
* occupancy statistics
* future analytics
* scalable booking logic

## Availability Formula

```text
availableBeds = totalBeds - SUM(reservationDays.bedsReserved)
```

---

# Tech Stack

| Category   | Technology           |
| ---------- | -------------------- |
| Framework  | Next.js 16           |
| Frontend   | React 19             |
| Language   | TypeScript           |
| Runtime    | Bun                  |
| Database   | PostgreSQL           |
| ORM        | Drizzle ORM          |
| Hosting DB | Neon                 |
| Styling    | Tailwind CSS         |
| UI         | Radix UI + shadcn    |
| Auth       | Lucia                |
| Validation | Zod                  |
| Forms      | React Hook Form      |
| Payments   | Stripe               |
| Emails     | Resend + React Email |
| Uploads    | Vercel Blob          |
| i18n       | next-intl            |
| State/Data | React Query          |
| Monitoring | Sentry               |

---

# UI/UX Direction

## Design Principles

* Minimal
* Modern
* Hiker-oriented
* Fast interactions
* Clean spacing
* Mobile usable

## Design References

* Airbnb
* Helm
* Røros Hotellene

---

# Main Layout

```text
┌──────────────────────────────────┐
│ Sidebar │ Main Content           │
│          │                       │
│ Filters  │ Cottage Grid          │
│ Nav      │ Cottage Cards         │
│          │ Search Results        │
└──────────────────────────────────┘
```

---

# Main Pages

## Public

* Home page
* Cottage listings
* Cottage detail
* Login/register

## Hiker Dashboard

* reservations
* profile
* reservation history

## Owner Dashboard

* reservations
* cottages
* analytics (future)
* calendar
* availability

## Admin Dashboard (future)

* moderation
* users
* reports
* reservations

---

# Payment Flow

```text
Reserve Beds
     │
     ▼
Stripe Checkout
     │
     ▼
Webhook Validation
     │
     ▼
Create Reservation
     │
     ▼
Send Confirmation Email
```

---

# Email System

## Transactional Emails

* email verification
* reservation confirmation
* owner notification
* cancellation confirmation
* refund confirmation
* password reset

---

# SEO Strategy

## Public Cottage Pages

Must include:

* dynamic metadata
* Open Graph images
* semantic HTML
* structured data
* sitemap generation

## Suggested Structured Data (future)

* LodgingBusiness
* FAQPage
* BreadcrumbList

---

# Security

## Existing Security

* hashed passwords
* email verification
* server-side validation
* protected reservation logic
* availability validation

## Recommended Additions

* rate limiting
* audit logs
* CSRF protection
* bot protection
* abuse detection
* webhook signature validation

---

# Scalability Considerations

## Multi-country Expansion

Prepare architecture for:

* multiple currencies
* localization
* multilingual content
* regional tax handling
* country-specific payment providers

## Suggested Future Countries

* Czech Republic
* Poland
* Austria
* Slovenia

---

# Monitoring & Observability

## Planned Monitoring

* Sentry
* reservation event logging
* email delivery tracking
* payment monitoring
* uptime monitoring

## Suggested Metrics

* conversion rate
* occupancy rate
* cancellation rate
* average reservation value
* owner response time

---

# Future Features

## High Priority

* reviews & ratings
* favorites/saved cottages
* route integration
* weather integration
* advanced analytics

## Medium Priority

* full online payments
* owner payouts
* dynamic pricing
* chat/messaging
* notifications

## Long-Term Vision

* mobile app
* AI route recommendations
* trail condition integrations
* offline mode
* smart recommendations

---

# Risks & Challenges

| Risk                        | Mitigation                |
| --------------------------- | ------------------------- |
| Overbooking                 | reservation_days strategy |
| Payment disputes            | Stripe webhooks + logs    |
| Fake reservations           | email verification        |
| Scaling availability checks | indexed reservation days  |
| Owner adoption              | simple onboarding         |

---

# MVP Scope

## Phase 1

* authentication
* cottage listings
* reservations
* owner dashboard
* Stripe reservation fee
* email confirmations

## Phase 2

* calendar management
* advanced filters
* admin moderation
* analytics

## Phase 3

* reviews
* hiking routes
* multilingual support
* mobile optimization

---

# Infrastructure

```text
Frontend:
- Vercel

Database:
- Neon PostgreSQL

Storage:
- Vercel Blob

Emails:
- Resend

Payments:
- Stripe

Monitoring:
- Sentry
```

---

# Product Principles

Napmmit should always prioritize:

1. Reservation reliability
2. Availability accuracy
3. Fast search experience
4. Simple owner workflows
5. Mobile usability
6. Clean and modern UI
7. Trust and transparency

---

# Summary

Napmmit solves a real operational and usability problem in the mountain cottage ecosystem by centralizing reservations and management into one modern platform.

The strongest technical foundations of the project are:

* reservation_days availability strategy
* centralized search
* scalable reservation lifecycle
* clean owner workflows
* modern React/Next.js stack
* future multi-country readiness

The project has strong potential as both:

* a niche booking platform
* a specialized operational SaaS for mountain accommodations
