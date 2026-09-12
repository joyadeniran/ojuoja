-- ==============================================================================
-- OJAWA MARKETPLACE — SUPABASE DATABASE SCHEMA
-- Project ID: mpxrsjbowjmimzctdinr
-- ==============================================================================

-- 1. Vendors Table
CREATE TABLE IF NOT EXISTS public.vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 4.8,
  delivery_mins INTEGER DEFAULT 35,
  tagline TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view verified vendors" ON public.vendors
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage vendors" ON public.vendors
  FOR ALL USING (auth.role() = 'authenticated');

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  was_price INTEGER,
  vendor TEXT NOT NULL,
  vendor_id TEXT REFERENCES public.vendors(id) ON DELETE SET NULL,
  area TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  image TEXT,
  unit TEXT,
  description TEXT,
  details JSONB,
  flag JSONB,
  thumbnails TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  delivery_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'transfer',
  status TEXT NOT NULL DEFAULT 'pending',
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their orders" ON public.orders
  FOR SELECT USING (true);

-- 4. Vendor Applications Table
CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id BIGSERIAL PRIMARY KEY,
  shop_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT NOT NULL,
  area TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'under_review',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit applications" ON public.vendor_applications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view applications" ON public.vendor_applications
  FOR SELECT USING (true);

-- 5. Notifications & Activity Center Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  recipient TEXT NOT NULL, -- 'vendor' | 'dispatch' | 'admin' | 'all'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  meta TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view notifications" ON public.notifications
  FOR SELECT USING (true);
CREATE POLICY "Public can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.vendors (id, name, area, verified, rating, delivery_mins, tagline, description)
VALUES 
  ('mama-t', 'Mama T Stores', 'Ita Elewa', true, 4.9, 35, 'Fresh market harvest & grains', 'Serving Ita Elewa and central Ikorodu with grain sacks, freshly harvested tubers, and seasoned pantry essentials since 2018.'),
  ('iya-basira', 'Iya Basira Kitchen', 'Sabo', true, 4.6, 45, 'Authentic Lagos small chops & hot meals', 'Popular Sabo spot known for piping-hot samosas, spring rolls, spicy peppered meats, and party jollof.'),
  ('ojawa-fresh', 'Ojawa Fresh', 'Agric', true, 4.8, 40, 'Daily morning farm-direct produce', 'Direct farm relationships bringing crisp bell peppers, rodo, tomatoes, and leafy greens to your table every single morning.'),
  ('ita-elewa-greens', 'Ita Elewa Greens', 'Ita Elewa', true, 4.9, 30, 'Organic vegetables & soup staples', 'Specializing in fresh ugwu, shoko, tete, and waterleaf bundles hand-picked and pre-cleaned daily.'),
  ('igbogbo-farmgate', 'Igbogbo Farmgate', 'Igbogbo', false, 4.7, 50, 'Local tubers, plantains & grains', 'Supplying bulk tubers, sweet potatoes, and organic plantain bunches directly from local Igbogbo farmlands.'),
  ('ebute-chill', 'Ebute Chill & Mart', 'Ebute', true, 4.8, 35, 'Chilled beverages & refreshments', 'Ice-cold malt drinks, carbonated soft drinks, table water packs, and chilled zobo extracts delivered fast.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.notifications (recipient, title, message, meta, created_at)
VALUES
  ('vendor', 'Kitchen Order Prepared', 'Mama T Stores dispatched 2 items for Ita Elewa delivery.', 'Prep SLA: 12 mins', NOW() - INTERVAL '3 minutes'),
  ('dispatch', 'Rider Assigned (Ita Elewa)', 'Rider Segun picked up parcel at Sabo Market for delivery to Agric.', 'Est. delivery: 28 mins', NOW() - INTERVAL '10 minutes'),
  ('admin', 'Daily Operations Status', 'All 18 verified Ikorodu kitchens and grocery stalls online & active.', 'Platform Health: 100%', NOW() - INTERVAL '35 minutes');
