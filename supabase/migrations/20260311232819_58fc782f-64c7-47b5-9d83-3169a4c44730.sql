
-- =============================================
-- RESERVATIONS TABLE
-- =============================================
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  renter_id uuid NOT NULL,
  host_id uuid NOT NULL,
  space_id uuid REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  volume numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Renters can view their own reservations
CREATE POLICY "Renters can view own reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id);

-- Hosts can view reservations on their spaces
CREATE POLICY "Hosts can view reservations on their spaces"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Renters can create reservations
CREATE POLICY "Renters can insert reservations"
  ON public.reservations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

-- Renters can update own reservations (e.g. cancel)
CREATE POLICY "Renters can update own reservations"
  ON public.reservations FOR UPDATE
  TO authenticated
  USING (auth.uid() = renter_id);

-- Hosts can update reservations on their spaces (e.g. approve/reject)
CREATE POLICY "Hosts can update reservations on their spaces"
  ON public.reservations FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

-- Admins can view all reservations
CREATE POLICY "Admins can view all reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all reservations
CREATE POLICY "Admins can update all reservations"
  ON public.reservations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES public.reservations(id) ON DELETE CASCADE NOT NULL,
  payer_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  platform_fee numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_method text DEFAULT '',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payers can view their own payments
CREATE POLICY "Payers can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = payer_id);

-- Recipients can view payments they receive
CREATE POLICY "Recipients can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

-- Payers can create payments
CREATE POLICY "Payers can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = payer_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all payments
CREATE POLICY "Admins can update all payments"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
