import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DBProject {
  id: string;
  name: string;
  description: string;
  scratch_id: string;
  likes: number;
  views: number;
  created_at: string;
  user_id: string;
  author?: string;
}

const Projects = () => {
  const { lang } = useAppStore();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    const projectList = data ?? [];

    // Fetch usernames
    const userIds = [...new Set(projectList.map((p) => p.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username")
      .in("user_id", userIds);

    const usernameMap = new Map(profiles?.map((p) => [p.user_id, p.username]) ?? []);

    setProjects(
      projectList.map((p) => ({ ...p, author: usernameMap.get(p.user_id) ?? "Unknown" }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "projects")}</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(lang, "search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-20">...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">{t(lang, "no_projects")}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={{
                id: p.id,
                name: p.name,
                description: p.description,
                scratchId: p.scratch_id,
                likes: p.likes,
                views: p.views,
                author: p.author ?? "Unknown",
              }}
              userId={user?.id}
              onLikeToggle={fetchProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
