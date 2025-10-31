-- ============================================
-- LOCALCART SCHEMA FIX (Continued without realtime conflicts)
-- ============================================

-- Enable realtime for tables that aren't already enabled
DO $$
BEGIN
  -- Try to add orders to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION WHEN duplicate_object THEN
    NULL; -- Table already in publication
  END;
  
  -- Try to add order_items to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  -- Try to add reviews to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  -- Try to add shops to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE shops;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- Set replica identity for realtime updates (safe to run multiple times)
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE order_items REPLICA IDENTITY FULL;
ALTER TABLE reviews REPLICA IDENTITY FULL;
ALTER TABLE shops REPLICA IDENTITY FULL;