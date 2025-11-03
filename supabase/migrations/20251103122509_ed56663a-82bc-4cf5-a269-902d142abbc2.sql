-- Drop all existing RLS policies from all tables

-- Drop policies from ads table
DROP POLICY IF EXISTS "Anyone can view active ads" ON public.ads;
DROP POLICY IF EXISTS "Shopkeepers can manage their shop ads" ON public.ads;

-- Drop policies from deliveries table
DROP POLICY IF EXISTS "Delivery partners can update their deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Delivery partners can view their deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can view delivery for their orders" ON public.deliveries;

-- Drop policies from feedback_reply table
DROP POLICY IF EXISTS "Vendors can create replies to their feedback" ON public.feedback_reply;
DROP POLICY IF EXISTS "Vendors can view replies to their feedback" ON public.feedback_reply;

-- Drop policies from notifications table
DROP POLICY IF EXISTS "Admins can send notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

-- Drop policies from order_items table
DROP POLICY IF EXISTS "Shopkeepers can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

-- Drop policies from orders table
DROP POLICY IF EXISTS "Delivery partners can view assigned orders" ON public.orders;
DROP POLICY IF EXISTS "Shopkeepers can view orders for their products" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Drop policies from products table
DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;
DROP POLICY IF EXISTS "Shopkeepers can manage their shop products" ON public.products;

-- Drop policies from profiles table
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Drop policies from reviews table
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for their orders" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

-- Drop policies from shops table
DROP POLICY IF EXISTS "Admins can manage all shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone can view shops" ON public.shops;
DROP POLICY IF EXISTS "Shopkeepers can delete their own shops" ON public.shops;
DROP POLICY IF EXISTS "Shopkeepers can insert their own shops" ON public.shops;
DROP POLICY IF EXISTS "Shopkeepers can update their own shops" ON public.shops;

-- Drop policies from user_roles table
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Drop policies from vendor_tasks table
DROP POLICY IF EXISTS "Vendors can manage their own tasks" ON public.vendor_tasks;
DROP POLICY IF EXISTS "Vendors can view their own tasks" ON public.vendor_tasks;

-- Verify RLS is still enabled (this is just a check, not changing anything)
-- All tables will still have RLS enabled, just no policies applied