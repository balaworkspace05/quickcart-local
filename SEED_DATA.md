# Seed Data Instructions

## Quick Start: Add Sample Products to LocalCart

To see the app in action with real data, follow these steps:

### Step 1: Create Vendor Accounts & Shops

1. Go to `/auth` and sign up as a vendor
2. Fill in shop details and upload a Google Pay QR code
3. After signup, you'll be redirected to `/vendor/dashboard`

### Step 2: Add Sample Products via SQL

Run this SQL in your Supabase SQL Editor to add sample products:

```sql
-- First, get your shop ID from the vendor dashboard or run:
-- SELECT id, name, owner_id FROM shops;

-- Replace 'YOUR_SHOP_ID' with your actual shop ID

-- Sample Grocery Products
INSERT INTO products (shop_id, name, description, category, price, original_price, stock, unit, is_available, image_url)
VALUES
  ('YOUR_SHOP_ID', 'Fresh Bananas', 'Ripe and fresh bananas, perfect for snacking', 'Grocery', 40, 50, 100, 'dozen', true, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'),
  ('YOUR_SHOP_ID', 'Red Apples', 'Crisp and sweet red apples', 'Grocery', 120, 150, 80, 'kg', true, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'),
  ('YOUR_SHOP_ID', 'Fresh Milk', 'Full cream fresh milk - 1 liter', 'Grocery', 60, null, 50, 'liter', true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
  ('YOUR_SHOP_ID', 'Brown Eggs', 'Farm fresh brown eggs', 'Grocery', 80, 90, 120, 'dozen', true, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'),
  ('YOUR_SHOP_ID', 'Basmati Rice', 'Premium quality basmati rice - 5kg pack', 'Grocery', 450, 500, 30, '5kg', true, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400');

-- Sample Bakery Products
INSERT INTO products (shop_id, name, description, category, price, original_price, stock, unit, is_available, image_url)
VALUES
  ('YOUR_SHOP_ID', 'Whole Wheat Bread', 'Freshly baked whole wheat bread loaf', 'Bakery', 35, 40, 50, 'loaf', true, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  ('YOUR_SHOP_ID', 'Butter Croissant', 'Flaky and buttery croissants', 'Bakery', 45, null, 40, 'piece', true, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
  ('YOUR_SHOP_ID', 'Chocolate Muffin', 'Rich chocolate chip muffins', 'Bakery', 50, 60, 35, 'piece', true, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400'),
  ('YOUR_SHOP_ID', 'Garlic Bread', 'Crispy garlic bread with herbs', 'Bakery', 80, null, 25, 'pack', true, 'https://images.unsplash.com/photo-1573140401552-388e7c2cc05c?w=400');

-- Sample Electronics Products
INSERT INTO products (shop_id, name, description, category, price, original_price, stock, unit, is_available, image_url)
VALUES
  ('YOUR_SHOP_ID', 'Bluetooth Earphones', 'Wireless Bluetooth 5.0 earphones with mic', 'Electronics', 999, 1499, 20, 'piece', true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'),
  ('YOUR_SHOP_ID', 'Phone Charger', 'Fast charging 20W USB-C charger', 'Electronics', 399, 599, 45, 'piece', true, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'),
  ('YOUR_SHOP_ID', 'Power Bank 10000mAh', 'Portable power bank with dual USB ports', 'Electronics', 799, 999, 30, 'piece', true, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'),
  ('YOUR_SHOP_ID', 'Wireless Mouse', 'Ergonomic wireless mouse with 2.4GHz connectivity', 'Electronics', 349, 499, 25, 'piece', true, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400');
```

### Step 3: Verify Data

1. **Vendor Side**: Go to `/vendor/inventory` - you should see all products
2. **Customer Side**: Go to `/market` - products should appear immediately
3. **Customer Dashboard**: Create a customer account and the dashboard should load without errors

### Step 4: Test Full Flow

1. As a customer, add products to cart and checkout
2. Enter delivery address and apply coupon code `LOCAL-CART01` for 15% off
3. Scan the vendor's GPay QR and confirm order
4. Check vendor dashboard for the new order
5. Check customer dashboard for order tracking

## Alternative: Use UI to Add Products

Instead of SQL, vendors can:
1. Go to `/vendor/inventory`
2. Click "Add Product"
3. Fill in details and upload image
4. Product appears instantly in marketplace

## Troubleshooting

**"Failed to load" on Customer Dashboard**:
- Make sure you're logged in as a customer (check role in profile)
- Clear browser cache and reload
- Check browser console for specific errors

**No products visible in Market**:
- Verify products have `is_available = true` and `stock > 0`
- Check products are linked to an active shop
- Refresh the page to trigger realtime updates

**Images not loading**:
- Unsplash URLs may require internet connection
- Replace with your own hosted images if needed
- Use relative paths for locally stored images
