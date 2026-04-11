
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash existing plaintext passwords
UPDATE public.chat_rooms 
SET password = crypt(password, gen_salt('bf')) 
WHERE password IS NOT NULL;

-- Update verify_room_password to use bcrypt comparison
CREATE OR REPLACE FUNCTION public.verify_room_password(p_room_id uuid, entered_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT password INTO stored_hash FROM public.chat_rooms WHERE id = p_room_id;
  
  IF stored_hash IS NULL THEN
    INSERT INTO public.room_members (room_id, user_id)
    VALUES (p_room_id, auth.uid())
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN true;
  END IF;
  
  IF stored_hash = crypt(entered_password, stored_hash) THEN
    INSERT INTO public.room_members (room_id, user_id)
    VALUES (p_room_id, auth.uid())
    ON CONFLICT (room_id, user_id) DO NOTHING;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Create a trigger to auto-hash passwords on INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.hash_room_password()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.password IS NOT NULL AND NEW.password != '' THEN
    -- Only hash if it doesn't look already hashed (bcrypt hashes start with $2)
    IF left(NEW.password, 2) != '$2' THEN
      NEW.password := crypt(NEW.password, gen_salt('bf'));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER hash_password_before_save
BEFORE INSERT OR UPDATE OF password ON public.chat_rooms
FOR EACH ROW
EXECUTE FUNCTION public.hash_room_password();
