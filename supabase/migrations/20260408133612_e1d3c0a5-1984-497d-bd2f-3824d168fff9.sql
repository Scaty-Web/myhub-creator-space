CREATE TABLE public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  password text DEFAULT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat rooms viewable by everyone" ON public.chat_rooms FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create rooms" ON public.chat_rooms FOR INSERT TO public WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can delete rooms" ON public.chat_rooms FOR DELETE TO public USING (auth.uid() = created_by);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  username text NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages viewable by everyone" ON public.chat_messages FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.chat_messages FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON public.chat_messages FOR DELETE TO public USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;