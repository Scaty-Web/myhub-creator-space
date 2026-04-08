
-- Fix 1: Revoke SELECT on password column from chat_rooms
REVOKE SELECT (password) ON public.chat_rooms FROM anon, authenticated;

-- Fix 2: Revoke UPDATE on likes and views columns from projects
REVOKE UPDATE (likes, views) ON public.projects FROM anon, authenticated;

-- Create a function to verify room passwords server-side
CREATE OR REPLACE FUNCTION public.verify_room_password(room_id uuid, entered_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_password text;
BEGIN
  SELECT password INTO stored_password FROM public.chat_rooms WHERE id = room_id;
  
  IF stored_password IS NULL THEN
    RETURN true;
  END IF;
  
  RETURN stored_password = entered_password;
END;
$$;
