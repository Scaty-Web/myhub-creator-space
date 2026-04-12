
DROP FUNCTION IF EXISTS public.hash_room_password() CASCADE;
DROP FUNCTION IF EXISTS public.verify_room_password(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.list_chat_rooms() CASCADE;

CREATE FUNCTION public.list_chat_rooms()
RETURNS TABLE(id uuid, name text, created_at timestamp with time zone, created_by uuid)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, name, created_at, created_by
  FROM public.chat_rooms
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.join_open_room(target_room_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.room_members (room_id, user_id)
  VALUES (target_room_id, auth.uid())
  ON CONFLICT (room_id, user_id) DO NOTHING;
  RETURN true;
END;
$$;

ALTER TABLE public.chat_rooms DROP COLUMN IF EXISTS password;
