-- Step 1: Add gpay_qr_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gpay_qr_url text;

-- Step 2: Migrate existing gpay_qr_url data from shops to profiles
UPDATE public.profiles p
SET gpay_qr_url = s.gpay_qr_url
FROM public.shops s
WHERE s.owner_id = p.id AND s.gpay_qr_url IS NOT NULL;

-- Step 3: Drop gpay_qr_url from shops table (data is now in profiles)
ALTER TABLE public.shops DROP COLUMN IF EXISTS gpay_qr_url;

-- Step 4: Update RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- Step 5: Update RLS policies on user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Step 6: Update RLS policies on shops table
DROP POLICY IF EXISTS "Anyone can view shops" ON public.shops;
DROP POLICY IF EXISTS "Shopkeepers can insert their own shops" ON public.shops;
DROP POLICY IF EXISTS "Shopkeepers can update their own shops" ON public.shops;
DROP POLICY IF EXISTS "Shopkeepers can delete their own shops" ON public.shops;

CREATE POLICY "Anyone can view shops" 
ON public.shops FOR SELECT 
USING (true);

CREATE POLICY "Shopkeepers can insert their own shops" 
ON public.shops FOR INSERT 
WITH CHECK (auth.uid() = owner_id AND has_role(auth.uid(), 'shopkeeper'));

CREATE POLICY "Shopkeepers can update their own shops" 
ON public.shops FOR UPDATE 
USING (auth.uid() = owner_id AND has_role(auth.uid(), 'shopkeeper'));

CREATE POLICY "Shopkeepers can delete their own shops" 
ON public.shops FOR DELETE 
USING (auth.uid() = owner_id AND has_role(auth.uid(), 'shopkeeper'));

CREATE POLICY "Admins can manage all shops" 
ON public.shops FOR ALL 
USING (has_role(auth.uid(), 'admin'));