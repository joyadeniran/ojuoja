# Ojawa Marketplace — System Specification

> Last updated: 2026-09-13

---

## 1. Auth Flows

### 1.1 Email / Password Sign-Up
1. User opens AuthModal → chooses role (Customer / Vendor / Dispatch) → enters name, email, password
2. `signUpUser()` passes `role` in `raw_user_meta_data` → Supabase trigger `handle_new_user()` writes profile row with correct role
3. Email confirmation (if enabled) → user clicks link → `SIGNED_IN` event fires → profile loaded → dashboard shown
4. **onboarding_complete = true** (role already captured at sign-up)

### 1.2 Google OAuth Sign-Up (THE GAP — being fixed)
1. User clicks "Continue with Google" → redirects to Google → returns
2. Supabase creates `auth.users` row + trigger fires → profile written with **`role = 'customer'` (default)** and **`onboarding_complete = false`**
3. App detects `provider === 'google'` AND `profile.onboarding_complete === false`
4. App immediately shows **OnboardingModal** (full-screen, non-dismissable)
5. OnboardingModal: 3-step wizard
   - **Step 1 — Role**: Pick Customer / Vendor / Dispatch Rider
   - **Step 2 — Details**: Role-specific fields (see below)
   - **Step 3 — Confirm**: Summary + save
6. On save: `upsertProfile()` sets `role`, `full_name`, `phone`, `vendor_store_name`, `onboarding_complete = true`
7. If vendor: create/link vendor record, store `vendor_id` in profile

### 1.3 Email / Password Sign-In
1. AuthModal → email + password → `signInUser()` → `SIGNED_IN` event → profile loaded → dashboard

### 1.4 Password Reset
1. "Forgot Password?" → enter email → `sendPasswordReset()` → email sent
2. User clicks email link → redirects to app with `#type=recovery` hash
3. App detects `PASSWORD_RECOVERY` event → opens AuthModal in `reset-update` mode
4. User enters new password → `updatePassword()` → success screen

---

## 2. Role Definitions & Onboarding Fields

### 2.1 Customer (default)
- **Extra fields at onboarding**: Phone number (optional), preferred delivery area
- **Access**: My Orders, My Profile, Browse Store, Basket

### 2.2 Vendor
- **Extra fields at onboarding**:
  - Store Name (required) → matched to `vendors` table or creates new pending vendor record
  - Area / Zone (required): Ita Elewa / Sabo / Agric / Igbogbo / Ebute
  - Category (required): Food & Snacks / Groceries / Drinks / Mixed
  - Phone (required)
- **After onboarding**: `profiles.vendor_id` = linked vendor record ID
- **Access**: Vendor Dashboard (own orders only), Store Settings

### 2.3 Dispatch Rider
- **Extra fields at onboarding**:
  - Phone (required)
  - Coverage Zone(s): multi-select
- **Access**: Dispatch Dashboard (all active/pending orders)

### 2.4 Admin (Super-Admin)
- **Set manually** in Supabase Table Editor (role cannot be self-assigned)
- **Access**: Full admin dashboard — all data, all overrides

---

## 3. Role → Data Access Matrix

| Resource | Customer | Vendor | Dispatch | Admin |
|---|---|---|---|---|
| **Browse store / products** | Yes | Yes | Yes | Yes |
| **Own orders (read)** | Yes | No | No | Yes |
| **Orders for own vendor (read)** | No | Yes (by vendor_store_name) | No | Yes |
| **All orders (read)** | No | No | Yes (active+pending) | Yes |
| **Update order status** | No | No | Yes (in_progress, completed) | Yes (any) |
| **Own profile (update)** | Yes | Yes | Yes | Yes |
| **Any profile (update)** | No | No | No | Yes |
| **Vendor store settings** | No | Yes (own store) | No | Yes |
| **Vendor applications (submit)** | Yes | Yes | Yes | Yes |
| **Vendor applications (review)** | No | No | No | Yes |
| **Platform stats** | No | No | No | Yes |
| **Role promotion/demotion** | No | No | No | Yes |
| **Delete/suspend user** | No | No | No | Yes |

---

## 4. Vendor Orders — Correct Attribution

**Problem**: Currently `getVendorOrders()` does fuzzy string matching of `item.vendor` against `currentUser.fullName`.

**Fix**:
1. Add `vendor_id TEXT` and `vendor_store_name TEXT` columns to `profiles`
2. After vendor onboarding, write `profile.vendor_store_name = storeName`
3. `getVendorOrders(vendorStoreName)` filters orders where `items[*].vendor = vendorStoreName`
4. VendorDashboard uses `currentUser.vendorStoreName` (from profile) not `currentUser.fullName`

---

## 5. Admin Override Capabilities

Super-admin can override:
- View ALL orders across all customers and vendors
- Update any order status
- View ALL user profiles with search and filter
- Promote or demote any user role via dropdown
- Approve or reject vendor applications
- Update any vendor's store settings
- Suspend/disable a user account
- Manually create and link vendor records

---

## 6. Database Schema (target state)

### `profiles` table (additions)
```sql
onboarding_complete  BOOLEAN NOT NULL DEFAULT false,
vendor_id            TEXT REFERENCES public.vendors(id) ON DELETE SET NULL,
vendor_store_name    TEXT,
preferred_area       TEXT,
```

### Trigger update
- Email sign-up: `onboarding_complete = true` (role was passed in metadata)
- Google OAuth: `onboarding_complete = false` (role selection deferred)

### RLS additions
- Dispatch: SELECT orders WHERE status IN ('pending', 'in_progress')
- Vendor: SELECT orders WHERE items contains their vendor_store_name (handled client-side via profile)

---

## 7. OnboardingModal — Step Flow

```
[Google Sign-in] → [SIGNED_IN event] → [profile.onboarding_complete = false?]
                                               YES
                                    [OnboardingModal — non-dismissable]
                                               |
                                    Step 1: Choose Role
                                    Customer / Vendor / Rider
                                               |
                             Customer      Vendor           Rider
                             Phone(opt)    Store Name       Phone(req)
                             Area(opt)     Area/Zone        Zone(s)
                                           Category
                                           Phone
                                               |
                                    Step 3: Review & Confirm
                                               |
                              upsertProfile({ role, vendor_id, onboarding_complete: true })
                                               |
                                    Dashboard shown
```

---

## 8. Files Created / Modified

| File | Action | Status |
|---|---|---|
| `supabase/schema.sql` | Add columns to profiles; update trigger; dispatch RLS; migration block | ✅ DONE |
| `src/lib/supabase.js` | `buildUserObject` exposes `onboardingComplete` + `vendorStoreName`; `suspendProfile`; `restoreProfile` | ✅ DONE |
| `src/components/Modals/OnboardingModal.jsx` | NEW: 3-step post-OAuth onboarding wizard | ✅ DONE |
| `src/App.jsx` | Detects `onboarding_complete=false` → shows OnboardingModal; wires onDone handler | ✅ DONE |
| `src/views/dashboards/VendorDashboard.jsx` | Uses `vendorStoreName` for exact order matching | ✅ DONE |
| `src/views/dashboards/AdminDashboard.jsx` | Suspend/restore user; improved users table | ✅ DONE |
