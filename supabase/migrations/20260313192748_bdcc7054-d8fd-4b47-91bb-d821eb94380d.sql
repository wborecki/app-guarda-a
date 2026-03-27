
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'spaces_count', (SELECT count(*) FROM public.spaces WHERE status = 'published'),
    'reservations_count', (SELECT count(*) FROM public.reservations),
    'cities_count', (
      SELECT count(DISTINCT 
        CASE 
          WHEN position(',' IN location) > 0 
          THEN trim(split_part(location, ',', 2))
          ELSE trim(location)
        END
      )
      FROM public.spaces 
      WHERE status = 'published' AND location IS NOT NULL AND location != ''
    )
  );
$$;
