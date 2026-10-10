-- ==============================================================================
-- OJAWA — MIGRATION v3: vendor approval fix, vendor tools, wallet & payments
-- Run once in Supabase SQL Editor (safe to re-run).
-- Tested for Supabase compatibility with resilient error handling.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. PREREQUISITE FUNCTIONS: ensure helper functions exist
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ORDERS: payment tracking columns & indexes
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status    TEXT NOT NULL DEFAULT 'unpaid';
-- payment_status: 'unpaid' | 'paid' | 'refunded'

CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON public.orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PRODUCTS: vendor-managed fields
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock        INTEGER;            -- NULL = unlimited
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;

-- Ensure vendors can INSERT and UPDATE their own products
DROP POLICY IF EXISTS "Vendors can manage own products" ON public.products;
CREATE POLICY "Vendors can manage own products" ON public.products FOR ALL USING (
  public.is_admin() OR (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM public.vendors v
        WHERE (v.id = products.vendor_id OR lower(v.name) = lower(products.vendor))
          AND (v.owner_id = auth.uid() OR v.owner_id IS NULL)
      )
      OR EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'vendor'
          AND (p.vendor_id = products.vendor_id OR lower(coalesce(p.vendor_store_name, '')) = lower(products.vendor))
      )
    )
  )
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. VENDORS: category + owner can edit public profile
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS phone    TEXT;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. HELPER & RLS: vendor order access
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.my_vendor_name()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT vendor_store_name FROM public.profiles
  WHERE id = auth.uid() AND role = 'vendor' LIMIT 1;
$$;

-- Safely inspect items JSON without throwing error if items is not an array
CREATE OR REPLACE FUNCTION public.order_has_my_items(p_items JSONB)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.my_vendor_name() IS NOT NULL AND (
    jsonb_typeof(p_items) = 'array' AND EXISTS (
      SELECT 1 FROM jsonb_array_elements(p_items) it
      WHERE lower(coalesce(it->>'vendor', '')) = lower(public.my_vendor_name())
    )
  );
$$;

DROP POLICY IF EXISTS "Vendors can view orders with their items" ON public.orders;
CREATE POLICY "Vendors can view orders with their items"
  ON public.orders FOR SELECT USING (public.order_has_my_items(items));

DROP POLICY IF EXISTS "Vendors can update orders with their items" ON public.orders;
CREATE POLICY "Vendors can update orders with their items"
  ON public.orders FOR UPDATE USING (public.order_has_my_items(items));

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ATOMIC VENDOR APPROVAL
--    Runs vendor approval, slug generation, profile upgrade, settings init,
--    and application status flip in a single transaction.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.approve_vendor_application(p_app_id BIGINT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app        public.vendor_applications%ROWTYPE;
  v_slug     TEXT;
  v_id       TEXT;
  v_n        INTEGER := 0;
  v_vendor   public.vendors%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve vendor applications';
  END IF;

  SELECT * INTO app FROM public.vendor_applications WHERE id = p_app_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_app_id;
  END IF;

  v_slug := trim(both '-' from regexp_replace(lower(coalesce(app.shop_name, 'vendor')), '[^a-z0-9]+', '-', 'g'));
  IF v_slug = '' THEN v_slug := 'vendor'; END IF;
  v_id := v_slug;

  -- Make the id unique unless this same owner already has that vendor row
  WHILE EXISTS (SELECT 1 FROM public.vendors WHERE id = v_id AND owner_id IS DISTINCT FROM app.applicant_id) LOOP
    v_n := v_n + 1;
    v_id := v_slug || '-' || v_n;
  END LOOP;

  INSERT INTO public.vendors (id, name, area, verified, rating, delivery_mins, tagline, description, owner_id, category, phone)
  VALUES (
    v_id, app.shop_name, coalesce(app.area, 'Ikorodu'), true, 4.8, 35,
    coalesce(app.category, 'General Store') || ' • ' || coalesce(app.area, 'Ikorodu'),
    'Verified merchant in ' || coalesce(app.area, 'Ikorodu') || '.',
    app.applicant_id, app.category, app.phone
  )
  ON CONFLICT (id) DO UPDATE SET verified = true, owner_id = EXCLUDED.owner_id
  RETURNING * INTO v_vendor;

  IF app.applicant_id IS NOT NULL THEN
    UPDATE public.profiles
       SET role = 'vendor', vendor_store_name = app.shop_name, vendor_id = v_id,
           onboarding_complete = true, updated_at = now()
     WHERE id = app.applicant_id;

    INSERT INTO public.vendor_store_settings (vendor_id, owner_id, is_open, opens_at, closes_at, banner_message)
    VALUES (v_id, app.applicant_id, true, '08:00', '22:00',
            'Welcome to ' || app.shop_name || '! Open and delivering across ' || coalesce(app.area, 'Ikorodu') || '.')
    ON CONFLICT (vendor_id) DO NOTHING;

    INSERT INTO public.notifications (recipient, title, message, meta, user_id)
    VALUES ('vendor', 'Vendor Application Approved! 🎉',
            'Your shop "' || app.shop_name || '" is approved. Open your Vendor Dashboard to add products.',
            'Zone: ' || coalesce(app.area, 'Ikorodu'), app.applicant_id);
  END IF;

  UPDATE public.vendor_applications SET status = 'approved' WHERE id = p_app_id;

  RETURN to_jsonb(v_vendor);
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_vendor_application(BIGINT) TO authenticated;

-- Safety net: collapse historical duplicate pending applications for shops that
-- already have a vendor row (they were "approved" but never marked as such).
UPDATE public.vendor_applications a
   SET status = 'approved'
 WHERE a.status = 'under_review'
   AND EXISTS (SELECT 1 FROM public.vendors v WHERE lower(v.name) = lower(a.shop_name));

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. PAYOUT ACCOUNTS & WITHDRAWALS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vendor_payout_accounts (
  vendor_id      TEXT PRIMARY KEY REFERENCES public.vendors(id) ON DELETE CASCADE,
  owner_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name   TEXT NOT NULL,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vendor_payout_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner manages payout account" ON public.vendor_payout_accounts;
CREATE POLICY "Owner manages payout account"
  ON public.vendor_payout_accounts FOR ALL
  USING (auth.uid() = owner_id OR public.is_admin())
  WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id             BIGSERIAL PRIMARY KEY,
  vendor_id      TEXT NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  owner_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount         INTEGER NOT NULL CHECK (amount > 0),
  status         TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'rejected'
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name   TEXT NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at   TIMESTAMPTZ
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner reads own withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Owner reads own withdrawals"
  ON public.withdrawal_requests FOR SELECT USING (auth.uid() = owner_id OR public.is_admin());

DROP POLICY IF EXISTS "Admin updates withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Admin updates withdrawals"
  ON public.withdrawal_requests FOR UPDATE USING (public.is_admin());

-- Platform commission (percent) taken on every completed order.
CREATE OR REPLACE FUNCTION public.platform_commission_pct() RETURNS NUMERIC
LANGUAGE sql IMMUTABLE AS $$ SELECT 10::NUMERIC $$;

-- Vendor wallet: earned (completed orders, net of commission), withdrawn, available.
CREATE OR REPLACE FUNCTION public.vendor_wallet()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name     TEXT := public.my_vendor_name();
  v_vendor   TEXT;
  v_gross    NUMERIC := 0;
  v_earned   NUMERIC;
  v_pending  NUMERIC := 0;
  v_taken    NUMERIC := 0;
BEGIN
  IF v_name IS NULL THEN
    RETURN jsonb_build_object('gross',0,'earned',0,'withdrawn',0,'pending_withdrawals',0,'available',0);
  END IF;
  SELECT vendor_id INTO v_vendor FROM public.profiles WHERE id = auth.uid();

  SELECT coalesce(sum( (it->>'price')::NUMERIC * coalesce((it->>'qty')::NUMERIC, 1) ), 0)
    INTO v_gross
    FROM public.orders o, jsonb_array_elements(o.items) it
   WHERE jsonb_typeof(o.items) = 'array'
     AND o.status = 'completed'
     AND lower(coalesce(it->>'vendor', '')) = lower(v_name);

  v_earned := round(v_gross * (1 - public.platform_commission_pct() / 100));

  SELECT coalesce(sum(amount) FILTER (WHERE status = 'paid'), 0),
         coalesce(sum(amount) FILTER (WHERE status = 'pending'), 0)
    INTO v_taken, v_pending
    FROM public.withdrawal_requests WHERE owner_id = auth.uid();

  RETURN jsonb_build_object(
    'gross', v_gross,
    'earned', v_earned,
    'withdrawn', v_taken,
    'pending_withdrawals', v_pending,
    'available', greatest(v_earned - v_taken - v_pending, 0),
    'commission_pct', public.platform_commission_pct()
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.vendor_wallet() TO authenticated;

CREATE OR REPLACE FUNCTION public.request_withdrawal(p_amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet  JSONB := public.vendor_wallet();
  v_vendor  TEXT;
  acct      public.vendor_payout_accounts%ROWTYPE;
  v_row     public.withdrawal_requests%ROWTYPE;
BEGIN
  SELECT vendor_id INTO v_vendor FROM public.profiles WHERE id = auth.uid() AND role = 'vendor';
  IF v_vendor IS NULL THEN RAISE EXCEPTION 'Only approved vendors can withdraw'; END IF;
  IF p_amount IS NULL OR p_amount < 1000 THEN RAISE EXCEPTION 'Minimum withdrawal is ₦1,000'; END IF;
  IF p_amount > (v_wallet->>'available')::NUMERIC THEN RAISE EXCEPTION 'Amount exceeds available balance'; END IF;

  SELECT * INTO acct FROM public.vendor_payout_accounts WHERE vendor_id = v_vendor;
  IF NOT FOUND THEN RAISE EXCEPTION 'Add your payout bank account first'; END IF;

  INSERT INTO public.withdrawal_requests (vendor_id, owner_id, amount, bank_name, account_number, account_name)
  VALUES (v_vendor, auth.uid(), p_amount, acct.bank_name, acct.account_number, acct.account_name)
  RETURNING * INTO v_row;

  INSERT INTO public.notifications (recipient, title, message, meta)
  VALUES ('admin', 'Withdrawal Request',
          'A vendor requested a payout of ₦' || p_amount, 'Request #' || v_row.id);

  RETURN to_jsonb(v_row);
END;
$$;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(INTEGER) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. STORAGE: public media bucket (product photos, avatars, store banners)
--    Wrapped in exception handling so that storage permission quirks
--    never block the core migration from succeeding.
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('ojawa-media', 'ojawa-media', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Notice: Storage bucket insertion handled by dashboard or permission limitation.';
END $$;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Media is publicly readable" ON storage.objects;
  CREATE POLICY "Media is publicly readable"
    ON storage.objects FOR SELECT USING (bucket_id = 'ojawa-media');

  DROP POLICY IF EXISTS "Users upload to own folder" ON storage.objects;
  CREATE POLICY "Users upload to own folder"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'ojawa-media' AND (storage.foldername(name))[1] = auth.uid()::text);

  DROP POLICY IF EXISTS "Users update own files" ON storage.objects;
  CREATE POLICY "Users update own files"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'ojawa-media' AND (storage.foldername(name))[1] = auth.uid()::text);

  DROP POLICY IF EXISTS "Users delete own files" ON storage.objects;
  CREATE POLICY "Users delete own files"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'ojawa-media' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Notice: Storage policies should be created via Supabase Dashboard > Storage > Policies.';
END $$;
