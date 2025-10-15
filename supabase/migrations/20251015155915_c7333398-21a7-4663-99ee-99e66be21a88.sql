-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create role enum
create type public.app_role as enum ('customer', 'shopkeeper', 'delivery');

-- Create order status enum
create type public.order_status as enum ('pending', 'confirmed', 'packed', 'out-for-delivery', 'delivered', 'cancelled');

-- Create delivery status enum
create type public.delivery_status as enum ('assigned', 'picked-up', 'in-transit', 'delivered');

-- =============================================
-- STEP 1: CREATE ALL TABLES FIRST
-- =============================================

-- 1. PROFILES TABLE (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  phone text,
  address text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. USER ROLES TABLE (separate for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 3. SHOPS TABLE
create table public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  logo_url text,
  location text not null,
  category text not null,
  rating numeric(2,1) default 0.0,
  is_open boolean default true,
  delivery_time text default '20-30 mins',
  distance text default '1.5 km',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. PRODUCTS TABLE
create table public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references public.shops(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  stock integer not null default 0,
  image_url text,
  category text not null,
  unit text default 'piece',
  is_available boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. ORDERS TABLE
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  status order_status not null default 'pending',
  total_amount numeric(10,2) not null,
  delivery_address text not null,
  delivery_instructions text,
  payment_status text default 'pending',
  payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. ORDER ITEMS TABLE
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  shop_id uuid references public.shops(id) on delete restrict not null,
  quantity integer not null,
  price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- 7. DELIVERIES TABLE
create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null unique,
  partner_id uuid references auth.users(id) on delete set null,
  status delivery_status not null default 'assigned',
  tracking_url text,
  pickup_time timestamptz,
  delivery_time timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. REVIEWS TABLE
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, order_id)
);

-- 9. ADS TABLE
create table public.ads (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references public.shops(id) on delete cascade not null,
  image_url text not null,
  title text,
  description text,
  active_status boolean default true,
  duration_days integer not null default 7,
  impressions_count integer default 0,
  clicks_count integer default 0,
  start_date timestamptz not null default now(),
  end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- STEP 2: CREATE SECURITY DEFINER FUNCTIONS
-- =============================================

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Function to get user role
create or replace function public.get_user_role(_user_id uuid)
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_roles
  where user_id = _user_id
  limit 1
$$;

-- =============================================
-- STEP 3: ENABLE RLS ON ALL TABLES
-- =============================================

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.shops enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.deliveries enable row level security;
alter table public.reviews enable row level security;
alter table public.ads enable row level security;

-- =============================================
-- STEP 4: CREATE RLS POLICIES
-- =============================================

-- PROFILES POLICIES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- USER ROLES POLICIES
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- SHOPS POLICIES
create policy "Anyone can view shops"
  on public.shops for select
  using (true);

create policy "Shopkeepers can insert their own shops"
  on public.shops for insert
  with check (auth.uid() = owner_id and public.has_role(auth.uid(), 'shopkeeper'));

create policy "Shopkeepers can update their own shops"
  on public.shops for update
  using (auth.uid() = owner_id and public.has_role(auth.uid(), 'shopkeeper'));

create policy "Shopkeepers can delete their own shops"
  on public.shops for delete
  using (auth.uid() = owner_id and public.has_role(auth.uid(), 'shopkeeper'));

-- PRODUCTS POLICIES
create policy "Anyone can view available products"
  on public.products for select
  using (is_available = true);

create policy "Shopkeepers can manage their shop products"
  on public.products for all
  using (
    exists (
      select 1 from public.shops
      where shops.id = products.shop_id
        and shops.owner_id = auth.uid()
    )
  );

-- ORDERS POLICIES
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Shopkeepers can view orders for their products"
  on public.orders for select
  using (
    exists (
      select 1 from public.order_items oi
      join public.products p on p.id = oi.product_id
      join public.shops s on s.id = p.shop_id
      where oi.order_id = orders.id
        and s.owner_id = auth.uid()
    )
  );

create policy "Delivery partners can view assigned orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.deliveries
      where deliveries.order_id = orders.id
        and deliveries.partner_id = auth.uid()
    )
  );

-- ORDER ITEMS POLICIES
create policy "Users can view their order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Users can create order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Shopkeepers can view their order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.shops
      where shops.id = order_items.shop_id
        and shops.owner_id = auth.uid()
    )
  );

-- DELIVERIES POLICIES
create policy "Users can view delivery for their orders"
  on public.deliveries for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = deliveries.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Delivery partners can view their deliveries"
  on public.deliveries for select
  using (auth.uid() = partner_id);

create policy "Delivery partners can update their deliveries"
  on public.deliveries for update
  using (auth.uid() = partner_id);

-- REVIEWS POLICIES
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Users can create reviews for their orders"
  on public.reviews for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.orders
      where orders.id = reviews.order_id
        and orders.user_id = auth.uid()
        and orders.status = 'delivered'
    )
  );

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ADS POLICIES
create policy "Anyone can view active ads"
  on public.ads for select
  using (active_status = true and (end_date is null or end_date > now()));

create policy "Shopkeepers can manage their shop ads"
  on public.ads for all
  using (
    exists (
      select 1 from public.shops
      where shops.id = ads.shop_id
        and shops.owner_id = auth.uid()
    )
  );

-- =============================================
-- STEP 5: ENABLE REALTIME
-- =============================================

alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.deliveries;

-- =============================================
-- STEP 6: CREATE TRIGGERS
-- =============================================

-- Trigger function for updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.shops
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.products
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.orders
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.deliveries
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.reviews
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.ads
  for each row execute function public.handle_updated_at();

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- STEP 7: CREATE INDEXES FOR PERFORMANCE
-- =============================================

create index idx_shops_owner on public.shops(owner_id);
create index idx_shops_category on public.shops(category);
create index idx_products_shop on public.products(shop_id);
create index idx_products_category on public.products(category);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_order_items_product on public.order_items(product_id);
create index idx_deliveries_partner on public.deliveries(partner_id);
create index idx_deliveries_order on public.deliveries(order_id);
create index idx_reviews_product on public.reviews(product_id);
create index idx_reviews_user on public.reviews(user_id);
create index idx_ads_shop on public.ads(shop_id);
create index idx_user_roles_user on public.user_roles(user_id);