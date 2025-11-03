-- Create a temporary policy to allow profile lookup by email during login
-- This is needed for the demo user login flow
CREATE POLICY "Allow profile lookup by email for login" 
ON public.profiles 
FOR SELECT 
USING (email IS NOT NULL);

-- Note: This allows anyone to query profiles by email
-- In production, you'd want a more secure approach