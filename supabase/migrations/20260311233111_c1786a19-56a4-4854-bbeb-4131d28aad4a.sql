
-- Make space_id nullable to support reservations from mock/external spaces
ALTER TABLE public.reservations ALTER COLUMN space_id DROP NOT NULL;
