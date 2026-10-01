-- ============================================================
-- PROMOTE blackfolio@gmail.com TO ADMIN (Super-Admin)
-- Project: https://supabase.com/dashboard/project/mpxrsjbowjmimzctdinr/sql
-- ============================================================

-- 1. Update public.profiles (sets admin role & bypasses onboarding wizard)
UPDATE public.profiles
SET
  role                = 'admin',
  onboarding_complete = true,
  updated_at          = NOW()
WHERE LOWER(email) = 'blackfolio@gmail.com';

-- 2. Update auth.users metadata to ensure session claims match
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE LOWER(email) = 'blackfolio@gmail.com';

-- 3. Verify the update
SELECT id, full_name, email, role, onboarding_complete, updated_at
FROM public.profiles
WHERE LOWER(email) = 'blackfolio@gmail.com';

