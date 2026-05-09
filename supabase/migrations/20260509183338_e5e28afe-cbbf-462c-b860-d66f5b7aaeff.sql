
REVOKE ALL ON FUNCTION public.create_chat_room(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.join_room_with_password(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_chat_room(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_room_with_password(uuid, text) TO authenticated;
