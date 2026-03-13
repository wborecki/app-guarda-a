
ALTER TABLE public.spaces
ADD COLUMN IF NOT EXISTS price_per_day numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS cleaning_fee_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cleaning_fee_amount numeric DEFAULT 0;
