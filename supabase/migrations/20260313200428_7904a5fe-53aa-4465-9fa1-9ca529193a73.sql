-- Add vehicle support columns to spaces table
ALTER TABLE public.spaces 
  ADD COLUMN IF NOT EXISTS space_use text NOT NULL DEFAULT 'objects',
  ADD COLUMN IF NOT EXISTS vehicle_compatible jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gate_width numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS gate_height numeric DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.spaces.space_use IS 'objects, vehicles, or both';
COMMENT ON COLUMN public.spaces.vehicle_compatible IS 'Array of vehicle category IDs this space supports';
COMMENT ON COLUMN public.spaces.gate_width IS 'Gate/entrance width in meters (relevant for vehicles)';
COMMENT ON COLUMN public.spaces.gate_height IS 'Gate/entrance height in meters (relevant for vehicles)';