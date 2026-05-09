
-- Ensure pgcrypto is available in the extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Add nullable password_hash column
ALTER TABLE public.chat_rooms ADD COLUMN IF NOT EXISTS password_hash text;

-- Replace list_chat_rooms to expose has_password but never the hash
DROP FUNCTION IF EXISTS public.list_chat_rooms();
CREATE OR REPLACE FUNCTION public.list_chat_rooms()
RETURNS TABLE(id uuid, name text, created_at timestamptz, created_by uuid, has_password boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, created_at, created_by, (password_hash IS NOT NULL) AS has_password
  FROM public.chat_rooms
  ORDER BY created_at DESC;
$$;

-- Create room securely with optional password
CREATE OR REPLACE FUNCTION public.create_chat_room(room_name text, room_password text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  new_id uuid;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF room_name IS NULL OR length(trim(room_name)) = 0 THEN
    RAISE EXCEPTION 'Room name required';
  END IF;

  INSERT INTO public.chat_rooms (name, created_by, password_hash)
  VALUES (
    trim(room_name),
    uid,
    CASE
      WHEN room_password IS NULL OR length(room_password) = 0 THEN NULL
      ELSE extensions.crypt(room_password, extensions.gen_salt('bf'))
    END
  )
  RETURNING id INTO new_id;

  INSERT INTO public.room_members (room_id, user_id)
  VALUES (new_id, uid)
  ON CONFLICT DO NOTHING;

  RETURN new_id;
END;
$$;

-- Join a room, validating password if required
CREATE OR REPLACE FUNCTION public.join_room_with_password(target_room_id uuid, room_password text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  stored_hash text;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT password_hash INTO stored_hash
  FROM public.chat_rooms
  WHERE id = target_room_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room not found';
  END IF;

  IF stored_hash IS NOT NULL THEN
    IF room_password IS NULL OR length(room_password) = 0 THEN
      RETURN false;
    END IF;
    IF extensions.crypt(room_password, stored_hash) <> stored_hash THEN
      RETURN false;
    END IF;
  END IF;

  INSERT INTO public.room_members (room_id, user_id)
  VALUES (target_room_id, uid)
  ON CONFLICT (room_id, user_id) DO NOTHING;

  RETURN true;
END;
$$;
