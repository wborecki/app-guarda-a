ALTER TABLE public.spaces 
  ADD COLUMN IF NOT EXISTS rental_type text NOT NULL DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS availability_schedule jsonb DEFAULT '{}'::jsonb;