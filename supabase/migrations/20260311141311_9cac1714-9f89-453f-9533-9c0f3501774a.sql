
-- Storage bucket for item photos
INSERT INTO storage.buckets (id, name, public) VALUES ('item-photos', 'item-photos', false);

-- RLS for item photos bucket
CREATE POLICY "Authenticated users can upload item photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'item-photos');

CREATE POLICY "Users can view item photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'item-photos');

CREATE POLICY "Users can delete own item photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Terms acceptances table
CREATE TABLE public.terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  term_type text NOT NULL,
  term_version text NOT NULL DEFAULT '1.0',
  accepted_at timestamptz NOT NULL DEFAULT now(),
  context text DEFAULT 'checkout'
);
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own acceptances" ON public.terms_acceptances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own acceptances" ON public.terms_acceptances FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Reservation photos table
CREATE TABLE public.reservation_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reservation_ref text NOT NULL,
  photo_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  risk_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reservation_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own photos" ON public.reservation_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own photos" ON public.reservation_photos FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Risk analyses table
CREATE TABLE public.risk_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_ref text NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  risk_level text DEFAULT 'low',
  notes text,
  reviewed_by text DEFAULT 'auto',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.risk_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analyses" ON public.risk_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Review requests (appeals)
CREATE TABLE public.review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_analysis_id uuid REFERENCES public.risk_analyses(id),
  user_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  protocol_number text NOT NULL,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create own reviews" ON public.review_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own reviews" ON public.review_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
