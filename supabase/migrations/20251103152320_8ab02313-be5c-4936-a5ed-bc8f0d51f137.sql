-- Make website public: Allow anonymous access to core tables

-- Drop restrictive policies on products and vendors
DROP POLICY IF EXISTS "Vendors can insert products" ON products;
DROP POLICY IF EXISTS "Vendors can update own products" ON products;
DROP POLICY IF EXISTS "Vendors can delete own products" ON products;
DROP POLICY IF EXISTS "Vendors can insert own shop" ON vendors;
DROP POLICY IF EXISTS "Vendors can update own shop" ON vendors;

-- Allow public INSERT on orders (for anonymous checkout)
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to manage products (for demo purposes)
CREATE POLICY "Anyone can manage products" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow anyone to manage vendors (for demo purposes)  
CREATE POLICY "Anyone can manage vendors" ON vendors
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- First create demo profile entries for vendors
INSERT INTO profiles (id, user_id, name, email, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'John Smith', 'freshmart@shop.com', 'vendor'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'techgalaxy@shop.com', 'vendor'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Dr. Michael Brown', 'pharmacy@health.com', 'vendor')
ON CONFLICT (id) DO NOTHING;

-- Now insert demo vendors
INSERT INTO vendors (id, user_id, shop_name, owner_name, email, phone, address)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Fresh Mart', 'John Smith', 'freshmart@shop.com', '+1-555-0101', '123 Market Street'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Tech Galaxy', 'Sarah Johnson', 'techgalaxy@shop.com', '+1-555-0102', '456 Electronics Ave'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'Pharmacy Plus', 'Dr. Michael Brown', 'pharmacy@health.com', '+1-555-0103', '789 Health Road')
ON CONFLICT (id) DO NOTHING;

-- Insert demo products
INSERT INTO products (id, vendor_id, name, description, category, price, original_price, stock, unit, in_stock, image_url)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Fresh Bananas', 'Organic ripe bananas from local farms', 'Fruits', 2.99, 3.99, 150, 'kg', true, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Whole Wheat Bread', 'Freshly baked whole wheat bread', 'Bakery', 3.49, 4.49, 80, 'loaf', true, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Fresh Milk', 'Farm fresh full cream milk', 'Dairy', 4.99, 5.99, 100, 'liter', true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Organic Tomatoes', 'Fresh organic tomatoes', 'Vegetables', 3.99, 4.99, 120, 'kg', true, 'https://images.unsplash.com/photo-1546470427-227c8d2c3ae5?w=400'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Bluetooth Earphones', 'Wireless earphones with noise cancellation', 'Electronics', 49.99, 79.99, 45, 'piece', true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Smart Watch', 'Fitness tracking smart watch', 'Electronics', 129.99, 199.99, 30, 'piece', true, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
  ('00000000-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'USB-C Cable', 'Fast charging USB-C cable 2m', 'Accessories', 9.99, 14.99, 200, 'piece', true, 'https://images.unsplash.com/photo-1603439544331-4e4fbe5119d6?w=400'),
  ('00000000-0000-0000-0000-000000000011', '33333333-3333-3333-3333-333333333333', 'Paracetamol 500mg', 'Pain relief tablets', 'Medicine', 5.99, 7.99, 500, 'pack', true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'),
  ('00000000-0000-0000-0000-000000000012', '33333333-3333-3333-3333-333333333333', 'Vitamin C Tablets', 'Immunity booster vitamin C', 'Supplements', 12.99, 16.99, 300, 'bottle', true, 'https://images.unsplash.com/photo-1550572017-4e6c5f161e0c?w=400'),
  ('00000000-0000-0000-0000-000000000013', '33333333-3333-3333-3333-333333333333', 'Hand Sanitizer', 'Antibacterial hand sanitizer 500ml', 'Healthcare', 7.99, 9.99, 150, 'bottle', true, 'https://images.unsplash.com/photo-1584744982493-c4dc0a7e91d0?w=400')
ON CONFLICT (id) DO NOTHING;