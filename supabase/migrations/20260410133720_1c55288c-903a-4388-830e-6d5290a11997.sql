
DROP FUNCTION IF EXISTS public.verify_room_password(uuid, text);

CREATE FUNCTION public.verify_room_password(p_room_id uuid, entered_password text)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  stored_password text;
BEGIN
  SELECT password INTO stored_password FROM public.chat_rooms WHERE id = p_room_id;
  
  IF stored_password IS NULL THEN
    INSERT INTO public.room_members (room_id, user_id)
    VALUES (p_room_id, auth.uid())
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN true;
  END IF;
  
  IF stored_password = entered_password THEN
    INSERT INTO public.room_members (room_id, user_id)
    VALUES (p_room_id, auth.uid())
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN true;
  END IF;

  RETURN false;
END;
$function$;
