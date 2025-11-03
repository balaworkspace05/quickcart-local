-- ========================================
-- STEP 1: Drop unused/stray tables
-- ========================================
DROP TABLE IF EXISTS public.ads CASCADE;
DROP TABLE IF EXISTS public.deliveries CASCADE;
DROP TABLE IF EXISTS public.feedback_reply CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.vendor_tasks CASCADE;

-- ========================================
-- STEP 2: Create/Update PROFILES table
-- ========================================
-- Drop existing profiles table to recreate with exact schema
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  location_lat NUMERIC,
  location_lng NUMERIC,
  verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
  gpay_qr_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 3: Create/Update USER_ROLES table
-- ========================================
DROP TABLE IF EXISTS public.user_roles CASCADE;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: Create VENDORS table (replaces shops)
-- ========================================
DROP TABLE IF EXISTS public.shops CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;

CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  owner_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  gpay_qr_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: Create/Update PRODUCTS table
-- ========================================
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INTEGER DEFAULT 0,
  unit TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 6: Create/Update ORDERS table
-- ========================================
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_mode TEXT DEFAULT 'cod' CHECK (payment_mode IN ('cod', 'online', 'gpay')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 7: Create FEEDBACK table
-- ========================================
DROP TABLE IF EXISTS public.feedback CASCADE;

CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 8: Create COUPONS table
-- ========================================
DROP TABLE IF EXISTS public.coupons CASCADE;

CREATE TABLE public.coupons (
  code TEXT PRIMARY KEY,
  discount_pct INTEGER NOT NULL CHECK (discount_pct >= 0 AND discount_pct <= 100),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_to TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 9: Create/Update NOTIFICATIONS table
-- ========================================
DROP TABLE IF EXISTS public.notifications CASCADE;

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_role TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 10: Create Storage Buckets
-- ========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-gpay', 'vendor-gpay', true)
ON CONFLICT (id) DO NOTHING;

-- product-images already exists

-- ========================================
-- STEP 11: RLS POLICIES
-- ========================================

-- PROFILES policies
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (role = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (role = 'admin');

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (role = 'admin');

-- USER_ROLES policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- VENDORS policies
CREATE POLICY "Vendors can insert their own shop"
  ON public.vendors FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view vendors"
  ON public.vendors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can update their own shop"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all vendors"
  ON public.vendors FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- PRODUCTS policies
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id IN (
    SELECT v.id FROM public.vendors v
    INNER JOIN public.profiles p ON v.user_id = p.id
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Vendors can update their products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (vendor_id IN (
    SELECT v.id FROM public.vendors v
    INNER JOIN public.profiles p ON v.user_id = p.id
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Vendors can delete their products"
  ON public.products FOR DELETE
  TO authenticated
  USING (vendor_id IN (
    SELECT v.id FROM public.vendors v
    INNER JOIN public.profiles p ON v.user_id = p.id
    WHERE p.user_id = auth.uid()
  ));

-- ORDERS policies
CREATE POLICY "Customers can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Customers can view their orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can view their orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (vendor_id IN (
    SELECT v.id FROM public.vendors v
    INNER JOIN public.profiles p ON v.user_id = p.id
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- FEEDBACK policies
CREATE POLICY "Customers can create feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can update feedback replies"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (vendor_id IN (
    SELECT v.id FROM public.vendors v
    INNER JOIN public.profiles p ON v.user_id = p.id
    WHERE p.user_id = auth.uid()
  ));

-- COUPONS policies
CREATE POLICY "Anyone can view coupons"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- NOTIFICATIONS policies
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (receiver_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can send notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- ========================================
-- STEP 12: Enable Realtime
-- ========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

-- ========================================
-- STEP 13: Update handle_new_user function
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, phone, address, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address',
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$;