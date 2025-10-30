-- Add Google Pay QR URL column to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS gpay_qr_url TEXT;

-- Add comment
COMMENT ON COLUMN shops.gpay_qr_url IS 'Google Pay QR code URL for vendor payments';

-- Enable realtime for products table
ALTER TABLE products REPLICA IDENTITY FULL;

-- Enable realtime for orders table
ALTER TABLE orders REPLICA IDENTITY FULL;