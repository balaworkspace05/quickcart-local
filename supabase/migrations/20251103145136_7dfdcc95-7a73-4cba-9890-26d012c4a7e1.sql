-- Step 1: Drop all existing RLS policies
DROP POLICY IF EXISTS "Anyone can view coupons" ON coupons;
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
DROP POLICY IF EXISTS "Customers can create feedback" ON feedback;
DROP POLICY IF EXISTS "Anyone can view feedback" ON feedback;
DROP POLICY IF EXISTS "Vendors can update feedback replies" ON feedback;
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can send notifications" ON notifications;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Customers can view their orders" ON orders;
DROP POLICY IF EXISTS "Vendors can view their orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Vendors can insert products" ON products;
DROP POLICY IF EXISTS "Vendors can update their products" ON products;
DROP POLICY IF EXISTS "Vendors can delete their products" ON products;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Vendors can insert their own shop" ON vendors;
DROP POLICY IF EXISTS "Anyone can view vendors" ON vendors;
DROP POLICY IF EXISTS "Vendors can update their own shop" ON vendors;
DROP POLICY IF EXISTS "Admins can manage all vendors" ON vendors;

-- Step 2: Drop user_roles table (no longer needed, role stored in profiles)
DROP TABLE IF EXISTS user_roles CASCADE;

-- Step 3: Update profiles table to ensure correct schema
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';
ALTER TABLE profiles ALTER COLUMN verified SET DEFAULT false;

-- Step 4: Ensure vendors table has correct schema
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_user_id_fkey;
ALTER TABLE vendors ADD CONSTRAINT vendors_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 5: Ensure products table has correct schema  
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_vendor_id_fkey;
ALTER TABLE products ADD CONSTRAINT products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;

-- Step 6: Ensure orders table has correct schema
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_vendor_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE orders ADD CONSTRAINT orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL;

-- Step 7: Ensure feedback table has correct schema
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_customer_id_fkey;
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_product_id_fkey;
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_vendor_id_fkey;
ALTER TABLE feedback ADD CONSTRAINT feedback_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE feedback ADD CONSTRAINT feedback_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE feedback ADD CONSTRAINT feedback_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL;

-- Step 8: Ensure notifications table has correct schema
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_receiver_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 9: Create new RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (role = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (role = 'admin');

-- Step 10: Create new RLS policies for vendors
CREATE POLICY "Anyone can view vendors"
  ON vendors FOR SELECT
  USING (true);

CREATE POLICY "Vendors can insert own shop"
  ON vendors FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can update own shop"
  ON vendors FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage vendors"
  ON vendors FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Step 11: Create new RLS policies for products
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Vendors can insert products"
  ON products FOR INSERT
  WITH CHECK (vendor_id IN (SELECT v.id FROM vendors v JOIN profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid()));

CREATE POLICY "Vendors can update own products"
  ON products FOR UPDATE
  USING (vendor_id IN (SELECT v.id FROM vendors v JOIN profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid()));

CREATE POLICY "Vendors can delete own products"
  ON products FOR DELETE
  USING (vendor_id IN (SELECT v.id FROM vendors v JOIN profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid()));

-- Step 12: Create new RLS policies for orders
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can view their orders"
  ON orders FOR SELECT
  USING (vendor_id IN (SELECT v.id FROM vendors v JOIN profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid()));

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Step 13: Create new RLS policies for feedback
CREATE POLICY "Anyone can view feedback"
  ON feedback FOR SELECT
  USING (true);

CREATE POLICY "Customers can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can reply to feedback"
  ON feedback FOR UPDATE
  USING (vendor_id IN (SELECT v.id FROM vendors v JOIN profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid()));

-- Step 14: Create new RLS policies for coupons
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Step 15: Create new RLS policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can send notifications"
  ON notifications FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));