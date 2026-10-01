# Ojawa Marketplace — Development Log

> Chronological record of all work completed

---

## 2026-09-12

### Phase 1 — UI / Branding Updates
- Updated header to include Login/Signup icons alongside basket icon
- Replaced brand colour placeholder with login/signup button using design system tokens
- Swapped header logo to primary Ojawa brand logo
- Generated hero section image: black female hand holding jollof rice in takeaway pack
- Increased body text font weight site-wide
- Made store names bolder; product names match body weight
- Footer: smaller logo all-white, larger logo at 20% opacity
- Fixed vendor verified page store name alignment and sizing
- Added vendor, dispatch, and admin notification system

### Phase 2 — Rebranding to Ojawa
- Applied new Ojawa brand identity from "Ojawa Brand Assets"
- Updated logo across header, footer, and all brand touchpoints
- Created PR and merged to `main`; Vercel deployed successfully

### Phase 3 — Mobile Responsiveness
- Fixed text overlapping the rounded pill navigation elements
- Fixed responsive layout across all screens (home, category, product, basket, vendors)
- Fixed mobile drawer navigation
- Fixed category filter pills on small screens

---

## 2026-09-12 — Supabase Integration

### Authentication System
- Connected to Supabase project `mpxrsjbowjmimzctdinr`
- Created `public.profiles` table with `id`, `full_name`, `email`, `phone`, `role`, `avatar_url`, `created_at`, `updated_at`
- Created `handle_new_user()` trigger: fires on `auth.users` INSERT → writes profile row automatically
- RLS enabled on `profiles`: users can read/update only their own row
- Implemented `getSession()`, `onAuthChange()`, `getProfile()`, `buildUserObject()`, `upsertProfile()` in `src/lib/supabase.js`
- Implemented `signUpUser()` — email or phone + password, passes `role` in metadata
- Implemented `signInUser()` — email or phone + password
- Implemented `signInWithGoogle()` — OAuth redirect flow with `detectSessionInUrl: true`
- Implemented `sendPasswordReset()` and `updatePassword()` for full password recovery flow
- Implemented `signOutUser()` — clears local session

### AuthModal Component
- Created `src/components/Modals/AuthModal.jsx` with modes: `login`, `signup`, `forgot`, `reset-update`
- Login: email/phone + password, Google OAuth button
- Sign-up: full name, role picker (Customer/Vendor/Dispatch), email/phone, password
- Forgot password: email → success confirmation screen
- Reset update: new password entry (triggered by `PASSWORD_RECOVERY` Supabase event)
- Header updated with dynamic Login/Signup and user profile dropdown with role badge

### Session Management
- `App.jsx`: `onAuthStateChange` listener handles `SIGNED_IN`, `INITIAL_SESSION`, `TOKEN_REFRESHED`, `SIGNED_OUT`, `PASSWORD_RECOVERY`
- Session persisted across page refreshes via `persistSession: true` on Supabase client

---

## 2026-09-12 — Orders & Notifications

### Orders Table
- Created `public.orders` table with JSONB `items`, `total`, `delivery_address`, `phone`, `payment_method`, `status`, `customer_id`, `created_at`
- RLS: customers can insert and read own orders
- `createOrder()` in supabase.js attaches `customer_id` from current session

### Notifications Table
- Created `public.notifications` table with `recipient`, `title`, `message`, `meta`, `created_at`
- Pre-seeded notifications for vendor, dispatch, admin roles
- `recordNotification()` in supabase.js persists each notification type

### Vendor Applications Table
- Created `public.vendor_applications` table
- `submitVendorApplication()` attaches `applicant_id` from current session

### Vendors Table
- Created `public.vendors` table with `id`, `name`, `area`, `verified`, `rating`, `eta`, `tagline`, `description`, `owner_id`
- Seeded with all 6 Ikorodu vendor records from `marketData.js`

---

## 2026-09-13 — Role-Based Dashboards (Phase 1)

### Schema Additions
- Added `is_admin()` SQL function (SECURITY DEFINER) — role check bypassing RLS
- Added `is_vendor()` SQL function (SECURITY DEFINER)
- Admin-override RLS policies: admin can SELECT/UPDATE all profiles, all orders, all vendor applications, all notifications
- Created `vendor_store_settings` table — vendor-specific open/close state, hours, banner
- Created `platform_stats` view — aggregate counts for admin overview

### Dashboard Data Layer (supabase.js additions)
- `getPlatformStats()` — admin: reads platform_stats view, falls back to direct queries
- `getAllProfiles()` — admin: all users ordered by creation date
- `updateProfileRole()` — admin: promote/demote any user
- `getAllOrders()` — admin: all orders with optional status filter
- `updateOrderStatus()` — admin: change any order status
- `getAllVendorApplications()` — admin: all vendor applications
- `updateApplicationStatus()` — admin: approve or reject
- `getVendorOrders()` — vendor: client-side filter by vendor name in order items
- `computeVendorStats()` — vendor: revenue, avg order, top products computed from orders
- `getVendorStoreSettings()` / `updateVendorStoreSettings()` — vendor store config
- `getMyOrders()` — customer: own orders via customer_id
- `updateMyProfile()` — customer: update own name/phone

### Customer Dashboard
- Profile card with inline editing (name, phone)
- Order history table with status badges
- Stats: total orders, saved items, total spend, completed count
- Sign out button

### Vendor Dashboard
- Store open/close toggle with visual status pill
- Live orders queue (pending orders for this vendor)
- Recent orders table with item detail, address, amount, status
- Top products sidebar (ranked by units sold)
- Store settings sidebar: hours, banner message, open toggle
- Stats: total orders, pending, revenue, avg order value

### Admin Dashboard (Super-Admin)
- 4-tab layout: Overview / Users / Orders / Applications
- Overview: 6-stat platform bar + recent orders + pending applications quick-review
- Users tab: searchable table, role filter, inline role promotion dropdown
- Orders tab: all orders, status filter, inline status update dropdown
- Applications tab: approve/reject with status pills, full application detail
- Persistent admin ribbon identifying restricted access

### Dispatch Rider Dashboard
- Live active deliveries queue (pending + in_progress)
- "Mark Picked Up" → in_progress (optimistic + Supabase sync)
- "Mark Delivered" → completed (optimistic + Supabase sync)
- Google Maps deep-link per delivery address
- Tappable customer phone number
- Zone filter: All / Ita Elewa / Sabo / Agric / Igbogbo / Ebute
- On Duty / Off Duty toggle
- Completed deliveries tab
- Stats row: pending pickups, in transit, delivered today, zone
- Pulsing NEW badge on brand-new pending orders

### DashboardRouter
- Role-gated: routes to correct dashboard by `currentUser.role`
- Login gate: unauthenticated users see sign-in prompt
- Header: "My Dashboard" added to user dropdown and mobile menu

---

## 2026-09-13 — Spec & Role Connectivity (Phase 2 — IN PROGRESS)

### Gap Analysis
- **Google OAuth + Role**: Google sign-in assigns `role = 'customer'` by default; no mechanism for user to select vendor/dispatch role
- **Vendor order matching**: Uses `currentUser.fullName` fuzzy match against `items[*].vendor` — breaks if display name ≠ store name
- **Missing profile fields**: `onboarding_complete`, `vendor_id`, `vendor_store_name`, `preferred_area` not yet in schema
- **Admin suspend/delete**: Not yet implemented

---

## 2026-09-14 — Role Connectivity Completion (Phase 2 — DONE)

### Schema Updates (`supabase/schema.sql`)
- Added `onboarding_complete BOOLEAN DEFAULT false` column to `public.profiles`
- Added `vendor_store_name TEXT` column — exact store name for order matching
- Added `vendor_id TEXT` column — optional link to `public.vendors`
- Added `preferred_area TEXT` column — customer delivery preference
- Updated `handle_new_user()` trigger:
  - Google OAuth: `role='customer'`, `onboarding_complete=false`
  - Email/phone signup: `role` from metadata, `onboarding_complete=true`
- Added idempotent `ALTER TABLE` migration block for existing live databases

### supabase.js Updates
- `buildUserObject()` now exposes `onboardingComplete` (from `profile.onboarding_complete`)
- `buildUserObject()` now exposes `vendorStoreName` (from `profile.vendor_store_name`)
- Added `suspendProfile(userId)` — sets role to 'suspended', blocks all access
- Added `restoreProfile(userId)` — resets suspended user back to 'customer'

### OnboardingModal.jsx (NEW)
- Created `src/components/Modals/OnboardingModal.jsx`
- 3-step, full-screen, non-dismissable post-Google-OAuth wizard:
  - **Step 1**: Visual role picker — Customer / Vendor / Dispatch Rider
  - **Step 2**: Role-specific fields (store name, zone, category for vendor; phone + zone multi-select for dispatch; optional phone + area for customer)
  - **Step 3**: Review + confirm summary before saving
- Calls `upsertProfile()` to set role, vendor_store_name, phone, preferred_area, onboarding_complete=true
- On success: calls `onDone(profile)` which updates `currentUser` state in App.jsx

### App.jsx Updates
- Imports `OnboardingModal`
- Added `onboardingUser` state to track pending post-OAuth onboarding sessions
- `onAuthChange` listener: detects `user.onboardingComplete === false` → stores userId/name in `onboardingUser`
- Renders `<OnboardingModal>` when `onboardingUser` is set (overlays everything)
- On modal completion: updates `currentUser.role`, `currentUser.vendorStoreName`, `currentUser.onboardingComplete` and shows success toast
- Sign-out clears `onboardingUser` state

### VendorDashboard.jsx Updates
- **Fixed order attribution**: Now uses `currentUser.vendorStoreName` (exact store name from profile) for `getVendorOrders()` and `computeVendorStats()` calls
- Falls back to `currentUser.fullName` for legacy/demo accounts
- Vendor record lookup now matches against `vendorStoreName`, not `fullName`

### AdminDashboard.jsx Updates
- Imports `suspendProfile` and `restoreProfile` from supabase.js
- Added `handleSuspend` and `handleRestore` callback handlers (optimistic state update)
- Users table: added **Suspend** button (red, with confirmation dialog) per non-suspended user
- Users table: **Restore** button for suspended users (green)
- Suspended users shown with red background + "SUSPENDED" badge, disabled role selector
- Role filter dropdown now includes "Suspended" option to show suspended accounts
- Users tab now passes `onSuspend` and `onRestore` props to `UsersSection`

### Build Verification
- `npm run build` exits with code 0 — no compilation errors
- 116 modules transformed; all new files (OnboardingModal.jsx) correctly resolved

---

## 2026-10-01 — Phase 2 Release & PR Merge
- Created standardized `CHANGELOG.md` following Keep a Changelog specifications
- Packaged role connectivity, OAuth onboarding wizard, admin suspension, and RLS security policies into feature branch
- Created pull request against `main` and merged to deploy

