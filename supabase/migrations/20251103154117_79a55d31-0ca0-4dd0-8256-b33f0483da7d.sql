-- Create manual users with specific credentials
-- Note: In production, passwords should be hashed properly
-- For demo purposes, we'll create profiles directly

-- First, let's ensure we have the customer profile
INSERT INTO public.profiles (id, user_id, name, email, phone, role, verified)
VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'Balaji Customer', 'balajij.bsc23@rvu.edu.in', '9876543210', 'customer', true),
  (gen_random_uuid(), gen_random_uuid(), 'Balaji Vendor', 'malibalaji1050@gmail.com', '9876543211', 'vendor', true)
ON CONFLICT DO NOTHING;

-- Create a vendor entry for the vendor user
INSERT INTO public.vendors (id, user_id, shop_name, owner_name, email, phone, address, logo_url)
SELECT 
  gen_random_uuid(),
  p.id,
  'Balaji Store',
  'Balaji Vendor',
  'malibalaji1050@gmail.com',
  '9876543211',
  '123 Main Street, Bangalore',
  'https://mbhuluzwspuiztpsldhm.supabase.co/storage/v1/object/public/shop-images/balaji-store-logo.svg'
FROM public.profiles p
WHERE p.email = 'malibalaji1050@gmail.com'
ON CONFLICT DO NOTHING;

-- Add some products for the vendor
INSERT INTO public.products (id, vendor_id, name, description, price, original_price, stock, in_stock, category, unit, image_url)
SELECT 
  gen_random_uuid(),
  v.id,
  'Fresh Apples',
  'Crispy red apples from local farms',
  120,
  150,
  100,
  true,
  'Fruits',
  'per kg',
  'https://mbhuluzwspuiztpsldhm.supabase.co/storage/v1/object/public/product-images/apples.svg'
FROM public.vendors v
WHERE v.email = 'malibalaji1050@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (id, vendor_id, name, description, price, original_price, stock, in_stock, category, unit, image_url)
SELECT 
  gen_random_uuid(),
  v.id,
  'Organic Tomatoes',
  'Fresh organic tomatoes',
  40,
  50,
  150,
  true,
  'Vegetables',
  'per kg',
  'https://mbhuluzwspuiztpsldhm.supabase.co/storage/v1/object/public/product-images/tomatoes.svg'
FROM public.vendors v
WHERE v.email = 'malibalaji1050@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (id, vendor_id, name, description, price, original_price, stock, in_stock, category, unit, image_url)
SELECT 
  gen_random_uuid(),
  v.id,
  'Fresh Milk',
  'Pure cow milk delivered daily',
  55,
  60,
  50,
  true,
  'Dairy',
  'per liter',
  'https://mbhuluzwspuiztpsldhm.supabase.co/storage/v1/object/public/product-images/milk.svg'
FROM public.vendors v
WHERE v.email = 'malibalaji1050@gmail.com'
ON CONFLICT DO NOTHING;