-- Allow anyone (including anonymous) to view published spaces
CREATE POLICY "Anyone can view published spaces"
ON public.spaces
FOR SELECT
TO public
USING (status = 'published');