
-- Drop the view since it won't work with security_invoker + restrictive policy
DROP VIEW IF EXISTS public.chat_rooms_public;

-- Create a SECURITY DEFINER function to list rooms without password
CREATE OR REPLACE FUNCTION public.list_chat_rooms()
  RETURNS TABLE(id uuid, name text, created_at timestamptz, created_by uuid, has_password boolean)
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
  SELECT id, name, created_at, created_by, (password IS NOT NULL) as has_password
  FROM public.chat_rooms
  ORDER BY created_at DESC;
$$;
