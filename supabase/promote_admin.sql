-- ============================================================
-- PROMOTE hello.blackfolio@gmail.com TO ADMIN (Super-Admin)
-- Project: https://supabase.com/dashboard/project/mpxrsjbowjmimzctdinr/sql
-- ============================================================

-- Step 1: Ensure Phase 2 profile columns exist (safe & idempotent)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vendor_store_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vendor_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_area TEXT;

-- Step 2: Elevate hello.blackfolio@gmail.com to admin & mark onboarding complete
UPDATE public.profiles
SET
  role                = 'admin',
  onboarding_complete = true,
  updated_at          = NOW()
WHERE LOWER(email) = 'hello.blackfolio@gmail.com';

-- Step 3: Sync auth metadata
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE LOWER(email) = 'hello.blackfolio@gmail.com';

-- Step 4: Verify the update
SELECT id, full_name, email, role, onboarding_complete, updated_at
FROM public.profiles
WHERE LOWER(email) = 'hello.blackfolio@gmail.com';
