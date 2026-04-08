import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Heart, Eye, ArrowLeft, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProjectData {
  id: string;
  name: string;
  description: string;
  scratch_id: string;
  likes: number;
  views: number;
  user_id: string;
  created_at: string;
  author?: string;
}

interface Comment {
  id: string;
  text: string;
  username: string;
  user_id: string;
  created_at: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { lang } = useAppStore();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", data.user_id)
      .single();

    setProject({ ...data, author: profile?.username ?? "Unknown" });
    setLoading(false);
  };

  const fetchComments = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("project_comments")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true });
    setComments(data ?? []);
  };

  const checkLiked = async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from("project_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("project_id", id)
      .single();
    setLiked(!!data);
  };

  useEffect(() => {
    fetchProject();
    fetchComments();
    checkLiked();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error(t(lang, "login_required"));
      return;
    }
    if (!id) return;

    if (liked) {
      await supabase
        .from("project_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("project_id", id);
    } else {
      await supabase
        .from("project_likes")
        .insert({ user_id: user.id, project_id: id });
    }
    setLiked(!liked);
    fetchProject();
  };

  const handleComment = async () => {
    if (!user) {
      toast.error(t(lang, "login_required"));
      return;
    }
    if (!commentText.trim() || !id) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    await supabase.from("project_comments").insert({
      project_id: id,
      user_id: user.id,
      username: profile?.username ?? "Unknown",
      text: commentText.trim(),
    });

    setCommentText("");
    fetchComments();
  };

  if (loading) {
    return <div className="container py-20 text-center text-muted-foreground">...</div>;
  }

  if (!project) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Proje bulunamadı / Project not found</p>
        <Link to="/projects" className="text-primary hover:underline mt-4 inline-block">
          <ArrowLeft className="inline h-4 w-4 mr-1" />
          {t(lang, "projects")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6 max-w-4xl">
      <Link to="/projects" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" />
        {t(lang, "projects")}
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
        <p className="text-muted-foreground">@{project.author}</p>
      </div>

      <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
        <iframe
          src={`https://ilgazmod.vercel.app/embed.html#${project.scratch_id}`}
          width="100%"
          height="100%"
          allowFullScreen
          className="border-0"
          title={project.name}
        />
      </div>

      <p className="text-foreground">{project.description}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-colors ${
            liked
              ? "border-pink-500 text-pink-500 bg-pink-500/10"
              : "border-border text-muted-foreground hover:text-pink-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {project.likes}
        </button>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="h-4 w-4" />
          {project.views}
        </span>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {lang === "tr" ? "Yorumlar" : "Comments"} ({comments.length})
        </h2>

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-secondary/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">@{c.username}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground">{c.text}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {lang === "tr" ? "Henüz yorum yok." : "No comments yet."}
            </p>
          )}
        </div>

        {user && (
          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={lang === "tr" ? "Yorum yaz..." : "Write a comment..."}
              className="bg-secondary border-border"
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <Button onClick={handleComment} size="icon" variant="default">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
