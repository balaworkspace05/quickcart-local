-- Ensure admin enum value exists in app_role type
DO $$ 
BEGIN
  -- Check if admin value exists in app_role enum
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'admin' 
    AND enumtypid = 'app_role'::regtype
  ) THEN
    ALTER TYPE app_role ADD VALUE 'admin';
  END IF;
END $$;