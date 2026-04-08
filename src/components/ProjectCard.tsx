import { Heart, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProjectData {
  id: string;
  name: string;
  description: string;
  scratchId: string;
  likes: number;
  views: number;
  author: string;
}

interface Props {
  project: ProjectData;
  userId?: string;
  onLikeToggle?: () => void;
}

const ProjectCard = ({ project, userId, onLikeToggle }: Props) => {
  const handleLike = async () => {
    if (!userId) {
      toast.error("Giriş yapmalısınız / Please log in");
      return;
    }

    // Check if already liked
    const { data: existing } = await supabase
      .from("project_likes")
      .select("id")
      .eq("user_id", userId)
      .eq("project_id", project.id)
      .single();

    if (existing) {
      await supabase.from("project_likes").delete().eq("id", existing.id);
    } else {
      await supabase.from("project_likes").insert({
        user_id: userId,
        project_id: project.id,
      });
    }

    onLikeToggle?.();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in hover:border-primary/40 transition-colors">
      <div className="w-full aspect-video">
        <iframe
          src={`https://ilgazmod.vercel.app/embed.html#${project.scratchId}`}
          width="100%"
          height="100%"
          allowFullScreen
          className="border-0"
          title={project.name}
        />
      </div>
      <Link to={`/project/${project.id}`} className="block p-4 space-y-2 hover:bg-secondary/30 transition-colors">
        <h3 className="font-semibold text-foreground">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
          <span className="text-xs">@{project.author}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-pink transition-colors"
            >
              <Heart className="h-4 w-4" />
              {project.likes}
            </button>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {project.views}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
