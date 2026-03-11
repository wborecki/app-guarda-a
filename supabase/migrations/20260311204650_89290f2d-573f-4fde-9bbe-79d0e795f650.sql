
-- Table to store host space listings
CREATE TABLE public.spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info (from step 1)
  location TEXT NOT NULL DEFAULT '',
  space_type TEXT NOT NULL DEFAULT '',
  space_category TEXT DEFAULT '',
  height NUMERIC DEFAULT 0,
  width NUMERIC DEFAULT 0,
  length NUMERIC DEFAULT 0,
  volume NUMERIC GENERATED ALWAYS AS (height * width * length) STORED,
  covered BOOLEAN DEFAULT false,
  closed BOOLEAN DEFAULT false,
  easy_access BOOLEAN DEFAULT false,
  
  -- Availability
  availability TEXT DEFAULT 'continuous',
  access_hours TEXT DEFAULT '',
  access_type TEXT DEFAULT '',
  available_days TEXT[] DEFAULT '{}',
  
  -- Details
  description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  rules TEXT DEFAULT '',
  security_features TEXT DEFAULT '',
  
  -- Photos (paths in storage)
  photos TEXT[] DEFAULT '{}',
  
  -- Payment info
  pix_key TEXT DEFAULT '',
  pix_key_type TEXT DEFAULT '',
  beneficiary_name TEXT DEFAULT '',
  document_number TEXT DEFAULT '',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft',
  onboarding_step INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spaces" ON public.spaces
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spaces" ON public.spaces
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spaces" ON public.spaces
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own spaces" ON public.spaces
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Storage bucket for space photos
INSERT INTO storage.buckets (id, name, public) VALUES ('space-photos', 'space-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload space photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'space-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view space photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'space-photos');

CREATE POLICY "Users can delete own space photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'space-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
