# Changelog

All notable changes to the Ojawa Marketplace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

- **Admin Vendor Approvals & Platform Vendor Management (`AdminDashboard.jsx`)**:
  - Dedicated **Vendor Approvals** queue tab with category, zone, application date, and applicant phone dial links.
  - End-to-end `approveVendorApplication` flow: updates application status to `approved`, creates merchant record in `public.vendors`, initializes `public.vendor_store_settings`, upgrades applicant's profile to `role = 'vendor'`, assigns `vendor_store_name`, and sends in-app notifications.
  - Dedicated **Active Vendors** management tab: view all marketplace stores, search by name/zone, and 1-click toggle for verified merchant badges (`toggleVendorVerification`).
  - Action feedback toast alerts in Admin Console for all operations.
- **Post-Google-OAuth Onboarding Wizard (`OnboardingModal.jsx`)**: 3-step mandatory onboarding modal for users signing up via Google OAuth to select role (Customer, Vendor, Dispatch Rider) and submit required profile metadata.
- **Profile Schema Expansion**:
  - `onboarding_complete` (boolean): Flags whether a user has finished initial onboarding.
  - `vendor_store_name` (text): Explicit vendor store name used for resilient order matching and attribution.
  - `vendor_id` (text): Relational link to `public.vendors`.
  - `preferred_area` (text): Preferred delivery zone for customer accounts.
- **Admin User Management Controls**:
  - Account suspension (`suspendProfile`) and restoration (`restoreProfile`) capabilities directly in `AdminDashboard.jsx`.
  - Suspended accounts visual badge, styling, and filter option in Admin Users table.
- **Admin Promotion Helper Script (`supabase/promote_admin.sql`)**: Safe SQL script for elevating administrative users in Supabase.
- **Role-Scoped Notification Security**:
  - Enhanced RLS policies in `supabase/schema.sql` restricting notification reads to role matches (`admin`, `vendor`, `dispatch`, `customer`), user-specific notifications, or platform broadcasts.
  - Notification mark-as-read DB sync on notification center open.

### Changed
- **Vendor Order Attribution**: `VendorDashboard.jsx` now filters pending and recent orders by `vendorStoreName` from profile (with fallback to `fullName` for backwards compatibility).
- **Trigger `handle_new_user()`**: Sets `onboarding_complete = false` and default `customer` role for OAuth providers, and inherits role metadata with `onboarding_complete = true` for email/password signups.
- **Database Policies**: Hardened RLS policies across `products`, `vendor_applications`, and `notifications`.

---

## [1.2.0] - 2026-09-13

### Added
- **Role-Based Dashboards**:
  - **Customer Dashboard**: Order history with live status pills, profile editing (name, phone), lifetime spend and completed orders metrics.
  - **Vendor Dashboard**: Live pending orders queue, revenue and average order value metrics, top products analytics, and store settings (open/closed toggle, delivery hours, announcement banner).
  - **Dispatch Rider Dashboard**: Real-time delivery queue (`pending` and `in_progress`), quick status updates ("Mark Picked Up", "Mark Delivered"), customer phone direct calling, and Google Maps destination links.
  - **Super-Admin Dashboard**: Platform-wide metrics, complete user management, global order status controller, and vendor application review queue with approve/reject workflow.
- **DashboardRouter**: Gated routing based on authenticated user's role with guest sign-in walls.
- **Schema Additions**: `is_admin()` and `is_vendor()` security definer functions, `vendor_store_settings` table, and `platform_stats` view.

---

## [1.1.0] - 2026-09-12

### Added
- **Supabase Authentication & Backend Integration**:
  - `public.profiles` table with automatic user creation trigger `handle_new_user()`.
  - `AuthModal.jsx` supporting email/password registration, login, forgot password, and reset password update.
  - Google OAuth integration with session persistence and auto-recovery.
  - `public.orders`, `public.notifications`, `public.vendors`, and `public.vendor_applications` tables with initial RLS policies.
- **Order Placement & Application Pipeline**:
  - End-to-end checkout with order persistence linked to authenticated customer profiles.
  - Vendor application modal submission pipeline with admin notification triggers.

---

## [1.0.0] - 2026-09-12

### Added
- **Brand Rebrand & Visual Identity (Ojawa)**:
  - Complete adoption of Ojawa brand design language, official logos, palette, and Avigea/Gilroy typography.
  - Responsive mobile drawer navigation, category filtering pills, and adaptive header navigation.
  - Product catalog for Ikorodu market vendors with verified vendor tagging, delivery zone filters, and shopping basket.
