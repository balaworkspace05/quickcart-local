# Seed Data Instructions

## Quick Start: Add Sample Products to LocalCart

To see the app in action with real data, follow these steps:

### Step 1: Create Vendor Account & Shop

**IMPORTANT:** Before adding products, you must first create a vendor account and shop:

1. Go to `/auth` and click "Sign Up"
2. Select **"Shopkeeper"** as your role
3. Fill in your details:
   - Shop Name (e.g., "LocalCart Fresh Market")
   - Email & Password
   - Phone Number
   - Shop Location (e.g., "Downtown, City Center")
   - Shop Category (e.g., "Grocery", "Bakery", or "Multi-Category Store")
4. Upload a Google Pay QR code (required for payments)
5. After signup, you'll be redirected to `/vendor/dashboard`

### Step 2: Get Your Shop ID

**Option A:** From the Database (Recommended)
1. Open Supabase SQL Editor
2. Run this query to get your shop ID:
```sql
SELECT id, name, owner_id FROM shops ORDER BY created_at DESC LIMIT 1;
```
3. Copy the `id` value (it will look like: `550e8400-e29b-41d4-a716-446655440000`)

**Option B:** From Browser Console
1. While logged in as vendor, open Browser DevTools (F12)
2. Go to Console tab
3. Run: `localStorage` and look for your shop data

### Step 3: Add Sample Products via SQL

**CRITICAL:** Replace `'YOUR_SHOP_ID'` with the actual UUID from Step 2 in ALL queries below!

Run this SQL in your Supabase SQL Editor to add sample products:

```sql
-- ⚠️ REPLACE 'YOUR_SHOP_ID' with your actual shop ID from Step 2!
-- Example: '550e8400-e29b-41d4-a716-446655440000'

-- Sample Grocery Products (5 items)
INSERT INTO products (shop_id, name, description, category, price, original_price, stock, unit, is_available, image_url)
VALUES
  ('YOUR_SHOP_ID', 'Fresh Bananas', 'Ripe and fresh bananas, perfect for snacking', 'Grocery', 40, 50, 100, 'dozen', true, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'),
  ('YOUR_SHOP_ID', 'Red Apples', 'Crisp and sweet red apples', 'Grocery', 120, 150, 80, 'kg', true, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'),
  ('YOUR_SHOP_ID', 'Fresh Milk', 'Full cream fresh milk - 1 liter', 'Grocery', 60, null, 50, 'liter', true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
  ('YOUR_SHOP_ID', 'Brown Eggs', 'Farm fresh brown eggs', 'Grocery', 80, 90, 120, 'dozen', true, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'),
  ('YOUR_SHOP_ID', 'Basmati Rice', 'Premium quality basmati rice - 5kg pack', 'Grocery', 450, 500, 30, '5kg', true, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400');

-- Sample Bakery Products (4 items)
INSERT INTO products (shop_id, name, description, category, price, original_price, stock, unit, is_available, image_url)
VALUES
  ('YOUR_SHOP_ID', 'Whole Wheat Bread', 'Freshly baked whole wheat bread loaf', 'Bakery', 35, 40, 50, 'loaf', true, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  ('YOUR_SHOP_ID', 'Butter Croissant', 'Flaky and buttery croissants', 'Bakery', 45, null, 40, 'piece', true, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
  ('YOUR_SHOP_ID', 'Chocolate Muffin', 'Rich chocolate chip muffins', 'Bakery', 50, 60, 35, 'piece', true, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400'),
  ('YOUR_SHOP_ID', 'Garlic Bread', 'Crispy garlic bread with herbs', 'Bakery', 80, null, 25, 'pack', true, 'https://images.unsplash.com/photo-1573140401552-388e7c2cc05c?w=400');

-- Sample Electronics Products (4 items)
INSERT INTO products (shop_id, name, description, category, price, original_price, stock, unit, is_available, image_url)
VALUES
  ('YOUR_SHOP_ID', 'Bluetooth Earphones', 'Wireless Bluetooth 5.0 earphones with mic', 'Electronics', 999, 1499, 20, 'piece', true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'),
  ('YOUR_SHOP_ID', 'Phone Charger', 'Fast charging 20W USB-C charger', 'Electronics', 399, 599, 45, 'piece', true, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'),
  ('YOUR_SHOP_ID', 'Power Bank 10000mAh', 'Portable power bank with dual USB ports', 'Electronics', 799, 999, 30, 'piece', true, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'),
  ('YOUR_SHOP_ID', 'Wireless Mouse', 'Ergonomic wireless mouse with 2.4GHz connectivity', 'Electronics', 349, 499, 25, 'piece', true, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400');
```

### Step 4: Verify Data is Loaded

1. **Vendor Side**: 
   - Go to `/vendor/inventory`
   - You should see all 13 products (5 Grocery + 4 Bakery + 4 Electronics)
   - Stock levels should be visible
   - All products should show as "Available"

2. **Customer Side**: 
   - Create a customer account at `/auth` (select "Customer" role)
   - Go to `/market`
   - All 13 products should appear with images and prices
   - Use search and category filters to test functionality
   - Dashboard should show "0 orders" (not "failed to load")

3. **Admin Access**:
   - Login as admin (email: `local-cart@shopping`, password: `123456789`)
   - Go to `/admin/dashboard`
   - View all users, orders, and system stats

### Step 5: Test Full E-Commerce Flow

1. **As Customer:**
   - Browse products in `/market`
   - Click "Buy Now" on any product
   - Enter delivery address
   - Apply coupon code `LOCAL-CART01` for 15% off
   - See vendor's GPay QR code in checkout modal
   - Confirm order
   - Check `/customer/dashboard` for order tracking
   - Go to `/customer/feedback` to leave a review after "delivery"

2. **As Vendor:**
   - Check `/vendor/dashboard` for new orders
   - Update order status in `/vendor/orders`
   - Reply to customer feedback in `/vendor/feedback`
   - Manage inventory in `/vendor/inventory`
   - Update profile and GPay QR in `/vendor/profile`

3. **Realtime Updates:**
   - Open Market page in one tab
   - Update product stock in Vendor Inventory in another tab
   - Market should update instantly (no refresh needed)
   - Same applies to order status changes

## Alternative: Use UI to Add Products Manually

Instead of SQL, vendors can add products one-by-one through the UI:

1. Login as vendor
2. Go to `/vendor/inventory`
3. Click **"Add Product"** button
4. Fill in all required fields:
   - Product Name
   - Description
   - Category (Grocery, Bakery, Electronics, etc.)
   - Price (₹)
   - Original Price (optional, for showing discounts)
   - Stock quantity
   - Unit (piece, kg, liter, dozen, etc.)
   - Upload product image
5. Click **"Add Product"**
6. Product appears instantly in marketplace and vendor inventory

**Tip:** The SQL method (Step 3) is much faster for adding multiple products at once!

## Troubleshooting

### "Failed to load" on Customer Dashboard
**Cause:** Query issue or no profile data  
**Solution:**
- Make sure you're logged in as a customer (not vendor/admin)
- Check that your user has a profile entry in the `profiles` table
- Run this SQL to verify:
  ```sql
  SELECT * FROM profiles WHERE id = auth.uid();
  ```
- If no profile exists, logout and signup again with customer role
- Clear browser cache and reload page

### No products visible in Market
**Cause:** Products not linked to shop or availability issue  
**Solution:**
- Verify products have `is_available = true` AND `stock > 0`
- Check that products are linked to an active shop:
  ```sql
  SELECT p.id, p.name, p.stock, p.is_available, s.name as shop_name
  FROM products p
  JOIN shops s ON p.shop_id = s.id
  ORDER BY p.created_at DESC;
  ```
- If shop_id is null, products won't display
- Refresh page to trigger realtime subscription updates

### Images not loading
**Cause:** Network issue or broken image URLs  
**Solution:**
- Unsplash URLs require active internet connection
- Check browser console for CORS or 404 errors
- Replace with your own hosted images if needed
- Upload images via Storage bucket for reliability:
  ```sql
  -- Check uploaded images in storage
  SELECT * FROM storage.objects WHERE bucket_id = 'product-images';
  ```

### GPay QR not showing in checkout
**Cause:** Vendor hasn't uploaded QR to profile  
**Solution:**
- Login as vendor
- Go to `/vendor/profile`
- Click "Edit Profile"
- Upload Google Pay QR image
- Click "Save Changes"
- QR is now stored in `profiles.gpay_qr_url` (not `shops` table)

### Orders not appearing in Vendor Dashboard
**Cause:** Shop ownership mismatch or RLS policy issue  
**Solution:**
- Verify shop is owned by logged-in vendor:
  ```sql
  SELECT s.id, s.name, s.owner_id, u.email
  FROM shops s
  JOIN auth.users u ON s.owner_id = u.id
  WHERE s.owner_id = auth.uid();
  ```
- Check order_items are linked to correct shop_id
- RLS policies filter orders by shop ownership

### Admin Dashboard not accessible
**Cause:** User doesn't have admin role  
**Solution:**
- Admin credentials are hardcoded for testing:
  - Email: `local-cart@shopping`
  - Password: `123456789`
- If you need to make another user admin, run:
  ```sql
  -- Get user ID first
  SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
  
  -- Add admin role
  INSERT INTO user_roles (user_id, role)
  VALUES ('USER_ID_FROM_ABOVE', 'admin');
  ```

### Realtime updates not working
**Cause:** Supabase realtime not enabled or subscription error  
**Solution:**
- Check browser console for realtime connection errors
- Realtime is already configured for:
  - Market page (products table)
  - Customer Dashboard (orders table)
  - Vendor Dashboard (products, order_items tables)
  - Feedback pages (reviews, feedback_reply tables)
- If updates still don't appear, hard refresh the page (Ctrl+F5)
