
-- Auto-create conversation when a reservation is created
CREATE OR REPLACE FUNCTION public.create_conversation_for_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.conversations (reservation_id, participant_a, participant_b)
  VALUES (NEW.id, NEW.renter_id, NEW.host_id)
  ON CONFLICT (reservation_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_conversation_on_reservation
  AFTER INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conversation_for_reservation();
