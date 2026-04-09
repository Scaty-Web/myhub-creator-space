
-- ============================================
-- FIX 1: Protect chat_rooms password column
-- ============================================

-- Revoke SELECT on password column from all roles
REVOKE SELECT (password) ON public.chat_rooms FROM anon, authenticated;

-- Explicitly grant SELECT only on safe columns
GRANT SELECT (id, name, created_at, created_by) ON public.chat_rooms TO anon, authenticated;

-- ============================================
-- FIX 2: Prevent owners from manipulating likes/views
-- ============================================

-- Revoke UPDATE on likes and views columns
REVOKE UPDATE (likes, views) ON public.projects FROM anon, authenticated;

-- Explicitly grant UPDATE only on user-editable columns
GRANT UPDATE (name, description, scratch_id) ON public.projects TO authenticated;
