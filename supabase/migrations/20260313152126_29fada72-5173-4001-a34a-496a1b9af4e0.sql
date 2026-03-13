
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'reservation',
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark as read) own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- System can insert notifications (via trigger with SECURITY DEFINER)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger function to notify host on new reservation
CREATE OR REPLACE FUNCTION public.notify_host_on_reservation()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (
    NEW.host_id,
    'new_reservation',
    'Nova reserva recebida!',
    'Você recebeu uma nova reserva de ' || COALESCE(NEW.volume::text, '0') || ' m³. Valor: R$ ' || COALESCE(NEW.total_price::text, '0'),
    jsonb_build_object(
      'reservation_id', NEW.id,
      'renter_id', NEW.renter_id,
      'space_id', NEW.space_id,
      'volume', NEW.volume,
      'total_price', NEW.total_price,
      'start_date', NEW.start_date,
      'end_date', NEW.end_date
    )
  );
  RETURN NEW;
END;
$$;

-- Attach trigger
CREATE TRIGGER on_reservation_created
  AFTER INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_host_on_reservation();

-- Also notify on status changes
CREATE OR REPLACE FUNCTION public.notify_on_reservation_update()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  _title text;
  _message text;
  _notify_user uuid;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'cancelled' THEN
    _title := 'Reserva cancelada';
    _message := 'Uma reserva foi cancelada.';
    -- Notify both host and renter
    INSERT INTO public.notifications (user_id, type, title, message, metadata)
    VALUES
      (NEW.host_id, 'reservation_cancelled', _title, _message, jsonb_build_object('reservation_id', NEW.id)),
      (NEW.renter_id, 'reservation_cancelled', _title, _message, jsonb_build_object('reservation_id', NEW.id));
    RETURN NEW;
  END IF;

  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    -- Notify renter that reservation was confirmed
    INSERT INTO public.notifications (user_id, type, title, message, metadata)
    VALUES (
      NEW.renter_id,
      'reservation_confirmed',
      'Reserva confirmada!',
      'Sua reserva foi confirmada pelo anfitrião.',
      jsonb_build_object('reservation_id', NEW.id)
    );
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_reservation_updated
  AFTER UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_reservation_update();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
