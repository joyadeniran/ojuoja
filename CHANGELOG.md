# Changelog

All notable changes to the Ojawa Marketplace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-10-10

### Added
- **Full Vendor Dashboard & Merchant Management (`VendorDashboard.jsx`)**:
  - **Overview Tab**: Live real-time metric cards (total revenue in NGN, active products count, pending orders queue, completed order totals), 7-day sales breakdown chart, and fast-action buttons.
  - **Product Catalog Management (`ProductModal`)**:
    - Product creation and editing interface supporting title, category, price, discount price, unit (kg, bag, pack), stock count, and description.
    - Product image upload directly to Supabase Storage with local URL fallback.
    - Product visibility toggle (`is_active` / in-stock) and deletion flow with confirmation dialog.
  - **Orders Tab**: Real-time order list with customer name, phone dial link, delivery address, item breakdown, and status updater (`pending` &rarr; `in_progress` &rarr; `completed` &rarr; `cancelled`).
  - **Wallet & Payouts Tab**:
    - Available balance, pending payout, and lifetime earnings display.
    - Bank account configuration (Bank Name, Account Number, Account Name) saved to `vendor_payout_accounts`.
    - Withdrawal request modal with balance validation and payout status history table (`pending`, `processed`, `rejected`).
  - **Store Profile Tab**: In-app management of merchant store name, description, phone number, delivery zone, opening hours, and open/closed status toggle.
- **HTML5 History Path Routing & Persistent Reloads**:
  - Replaced hash anchors with standard clean browser paths: `/` (Home), `/dashboard` (Dashboard), `/vendors` (Vendors), `/basket` (Cart), `/profile` (Profile), `/category` (Categories), and `/product?id=...` (Product Details).
  - Synchronized browser URL bar with `window.history.pushState` / `replaceState` and added `popstate` event listeners for native Back / Forward browser navigation.
  - Added `parseLocation()` URL initializer so reloading a page preserves the current view without resetting to homepage.
  - Added [vercel.json](file:///Users/joyadeniran/Documents/ojuoja/vercel.json) SPA rewrite rule (`/(.*)` &rarr; `/index.html`) ensuring clean paths and page reloads never 404 on Vercel.
- **Paystack Payment & Edge Function Integration**:
  - Customer checkout via Paystack popup in `BasketScreen.jsx` with email capture and transaction references.
  - Supabase Edge Function (`supabase/functions/paystack-webhook/index.ts`) validating Paystack HMAC-SHA512 webhook signatures, updating order status to `paid`, advancing to `in_progress`, and generating automated vendor/admin notifications.
- **Super-Admin Payout Approval Flow (`AdminDashboard.jsx`)**:
  - Dedicated **Payouts** tab in the Super-Admin console.
  - Full withdrawal review queue displaying vendor identity, requested amount, bank details, and timestamps with 1-click Approve (with payment reference) or Reject (with note).
- **Vendor Migration v3 (`supabase/migration_v3_vendor_payments.sql`)**:
  - New schema tables: `vendor_payout_accounts`, `vendor_withdrawals`, and `vendor_wallets` view.
  - Robust JSON item validation (`jsonb_typeof(items) = 'array'`) protecting against malformed order rows.
  - RLS policies allowing authenticated vendors to insert, update, and manage their own products.
  - Exception-guarded storage bucket initialization preventing permission aborts during migrations.
- **User Profile Management (`ProfileScreen.jsx` & `ProfileCard.jsx`)**:
  - Dedicated user profile screen at `/profile` for all roles to update name, phone number, preferred area, and avatar photo.
  - Application review status banner on customer dashboard for pending vendor applicants.
- **Vendored Lucide Icons & Responsive Design**:
  - Vendored missing Lucide SVG icons (`activity`, `alert-circle`, `arrow-down-circle`, `bar-chart-2`, `check-circle`, `image`, `inbox`, `landmark`, `layout-dashboard`, `list`, `lock`, `log-out`, `settings`, `shopping-bag`, `slash`, `trending-up`, `zap`) into `assets/icons/`.
  - Added responsive dashboard rules in `src/dashboard.css` replacing fixed 2-column desktop layouts with mobile-friendly stacks.

### Changed
- **Vendor Resilience (`src/lib/supabase.js`)**:
  - Implemented `getMyVendor()` auto-linking to prevent merchant stores from disappearing when vendor accounts log in.
  - Hybrid data merging for products and vendors between live Supabase DB records and static market fallback data.
- **Breadcrumbs & Navigation Links**: Replaced `#home`, `#category`, `#vendors` in `Header.jsx`, `Footer.jsx`, `BasketScreen.jsx`, `ProductScreen.jsx`, `CategoryScreen.jsx`, and `VendorDirectoryScreen.jsx` with clean paths.

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
