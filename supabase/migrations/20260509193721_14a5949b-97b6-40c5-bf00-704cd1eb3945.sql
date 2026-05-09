
DROP TRIGGER IF EXISTS set_chat_messages_username ON public.chat_messages;
CREATE TRIGGER set_chat_messages_username
BEFORE INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.set_username_from_profile();

DROP TRIGGER IF EXISTS set_project_comments_username ON public.project_comments;
CREATE TRIGGER set_project_comments_username
BEFORE INSERT ON public.project_comments
FOR EACH ROW EXECUTE FUNCTION public.set_username_from_profile();
