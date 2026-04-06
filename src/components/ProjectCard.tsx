import { Heart, Eye } from "lucide-react";
import { useAppStore, type Project } from "@/lib/store";
import { t } from "@/lib/i18n";

const ProjectCard = ({ project }: { project: Project }) => {
  const { lang, likeProject } = useAppStore();

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
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
          <span className="text-xs">@{project.author}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => likeProject(project.id)}
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
      </div>
    </div>
  );
};

export default ProjectCard;
