
-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  space_id uuid REFERENCES public.spaces(id) ON DELETE SET NULL,
  reviewer_id uuid NOT NULL,
  host_id uuid NOT NULL,
  rating smallint NOT NULL,
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(reservation_id, reviewer_id)
);

-- Add validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_review_rating()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_review_rating
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_review_rating();

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews (public transparency)
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  TO public
  USING (true);

-- Users can insert reviews for their own completed reservations
CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Users can update own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
