
-- Create a public view of chat_rooms excluding the password column
CREATE VIEW public.chat_rooms_public
WITH (security_invoker = on) AS
  SELECT id, name, created_at, created_by
  FROM public.chat_rooms;

-- Drop the old permissive SELECT policy that exposes password
DROP POLICY IF EXISTS "Chat rooms viewable by everyone" ON public.chat_rooms;

-- Create a restrictive SELECT policy - only room creators can read their own rooms directly
-- All other access goes through the view or SECURITY DEFINER functions
CREATE POLICY "No direct public read"
  ON public.chat_rooms FOR SELECT
  TO public
  USING (auth.uid() = created_by);
