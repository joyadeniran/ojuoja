-- ============================================================
-- PROMOTE blackfolio@gmail.com TO ADMIN
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

UPDATE public.profiles
SET
  role       = 'admin',
  updated_at = NOW()
WHERE email = 'blackfolio@gmail.com';

-- Verify it worked (should return 1 row with role = 'admin')
SELECT id, full_name, email, role, updated_at
FROM public.profiles
WHERE email = 'blackfolio@gmail.com';
