
-- Revoke SELECT on password column from all roles to prevent exposure
REVOKE SELECT (password) ON public.chat_rooms FROM anon, authenticated;

-- Also revoke UPDATE on likes/views from authenticated to prevent manipulation
REVOKE UPDATE (likes, views) ON public.projects FROM anon, authenticated;
