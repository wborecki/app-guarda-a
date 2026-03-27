
-- Conversations table (one per reservation between host and renter)
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  participant_a uuid NOT NULL,
  participant_b uuid NOT NULL,
  last_message_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(reservation_id)
);

-- Messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_conversations_participants ON public.conversations(participant_a, participant_b);

-- RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view own conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

CREATE POLICY "Participants can insert conversations"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = participant_a OR auth.uid() = participant_b);

CREATE POLICY "Participants can update own conversations"
  ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

CREATE POLICY "Admins can view all conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages in their conversations"
  ON public.messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())
    )
  );

CREATE POLICY "Sender can update own messages"
  ON public.messages FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
