-- Create feedback_reply table for vendor responses
CREATE TABLE IF NOT EXISTS public.feedback_reply (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback_reply ENABLE ROW LEVEL SECURITY;

-- Policies for feedback_reply
CREATE POLICY "Vendors can view replies to their feedback"
ON public.feedback_reply
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM reviews r
    JOIN products p ON r.product_id = p.id
    JOIN shops s ON p.shop_id = s.id
    WHERE r.id = feedback_reply.feedback_id
    AND s.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can create replies to their feedback"
ON public.feedback_reply
FOR INSERT
WITH CHECK (
  auth.uid() = vendor_id
  AND EXISTS (
    SELECT 1 FROM reviews r
    JOIN products p ON r.product_id = p.id
    JOIN shops s ON p.shop_id = s.id
    WHERE r.id = feedback_reply.feedback_id
    AND s.owner_id = auth.uid()
  )
);

-- Create vendor_tasks table for performance tracking
CREATE TABLE IF NOT EXISTS public.vendor_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  task TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.vendor_tasks ENABLE ROW LEVEL SECURITY;

-- Policies for vendor_tasks
CREATE POLICY "Vendors can view their own tasks"
ON public.vendor_tasks
FOR SELECT
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can manage their own tasks"
ON public.vendor_tasks
FOR ALL
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);