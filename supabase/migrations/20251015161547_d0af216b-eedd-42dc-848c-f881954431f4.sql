-- Create storage buckets for shop and product images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('shop-images', 'shop-images', true),
  ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for shop images
CREATE POLICY "Shop images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop-images');

CREATE POLICY "Authenticated users can upload shop images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'shop-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Shop owners can update their shop images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'shop-images' AND auth.role() = 'authenticated');

CREATE POLICY "Shop owners can delete their shop images"
ON storage.objects FOR DELETE
USING (bucket_id = 'shop-images' AND auth.role() = 'authenticated');

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Shop owners can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Shop owners can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');