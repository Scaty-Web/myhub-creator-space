
-- 1. Create room_members table
CREATE TABLE public.room_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view memberships"
  ON public.room_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System manages memberships"
  ON public.room_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave rooms"
  ON public.room_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 2. Update chat_messages SELECT policy to require membership
DROP POLICY IF EXISTS "Messages viewable by everyone" ON public.chat_messages;

CREATE POLICY "Members can read messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members
      WHERE room_members.room_id = chat_messages.room_id
        AND room_members.user_id = auth.uid()
    )
  );

-- Also gate INSERT on membership
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.chat_messages;

CREATE POLICY "Members can send messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.room_members
      WHERE room_members.room_id = chat_messages.room_id
        AND room_members.user_id = auth.uid()
    )
  );

-- 3. Update verify_room_password to also insert membership on success
CREATE OR REPLACE FUNCTION public.verify_room_password(room_id uuid, entered_password text)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  stored_password text;
BEGIN
  SELECT password INTO stored_password FROM public.chat_rooms WHERE id = room_id;
  
  IF stored_password IS NULL THEN
    -- Open room: auto-grant membership
    INSERT INTO public.room_members (room_id, user_id)
    VALUES (verify_room_password.room_id, auth.uid())
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN true;
  END IF;
  
  IF stored_password = entered_password THEN
    INSERT INTO public.room_members (room_id, user_id)
    VALUES (verify_room_password.room_id, auth.uid())
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- 4. Create a function to join open rooms directly
CREATE OR REPLACE FUNCTION public.join_open_room(target_room_id uuid)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  stored_password text;
BEGIN
  SELECT password INTO stored_password FROM public.chat_rooms WHERE id = target_room_id;
  
  IF stored_password IS NOT NULL THEN
    RETURN false; -- Room has password, can't auto-join
  END IF;
  
  INSERT INTO public.room_members (room_id, user_id)
  VALUES (target_room_id, auth.uid())
  ON CONFLICT (room_id, user_id) DO NOTHING;
  
  RETURN true;
END;
$$;

-- 5. Auto-add room creator as member (trigger)
CREATE OR REPLACE FUNCTION public.auto_add_room_creator()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.room_members (room_id, user_id)
  VALUES (NEW.id, NEW.created_by)
  ON CONFLICT (room_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_add_room_creator
  AFTER INSERT ON public.chat_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_add_room_creator();
