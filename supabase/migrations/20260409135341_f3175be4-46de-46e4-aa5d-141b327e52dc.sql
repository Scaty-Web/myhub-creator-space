
-- Drop the existing broad SELECT policy
DROP POLICY IF EXISTS "Chat rooms viewable by everyone" ON public.chat_rooms;

-- Create a new SELECT policy that still allows everyone to see rooms
-- but we rely on column-level revoke (already applied) to block password
CREATE POLICY "Chat rooms viewable by everyone"
ON public.chat_rooms
FOR SELECT
USING (true);

-- Re-enforce column-level revoke in case it wasn't applied
REVOKE SELECT (password) ON public.chat_rooms FROM anon, authenticated;

-- Grant SELECT only on non-sensitive columns explicitly
GRANT SELECT (id, name, created_at, created_by) ON public.chat_rooms TO anon, authenticated;
