import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus, Heart, Eye } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  scratch_id: string;
  likes: number;
  views: number;
  created_at: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { lang } = useAppStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId!)
      .single();

    if (prof) {
      setProfile(prof as Profile);

      const [{ count: fc }, { count: fgc }, { data: projs }] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId!),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId!),
        supabase.from("projects").select("*").eq("user_id", userId!).order("created_at", { ascending: false }),
      ]);

      setFollowers(fc ?? 0);
      setFollowing(fgc ?? 0);
      setProjects((projs as Project[]) ?? []);

      if (user && user.id !== userId) {
        const { data: fw } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", user.id)
          .eq("following_id", userId!)
          .maybeSingle();
        setIsFollowing(!!fw);
      }
    }

    setLoading(false);
  };

  const toggleFollow = async () => {
    if (!user) {
      toast.error(t(lang, "login_required"));
      return;
    }

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", userId!);
      setIsFollowing(false);
      setFollowers((p) => p - 1);
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: userId! });
      setIsFollowing(true);
      setFollowers((p) => p + 1);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl py-20 text-center">
        <div className="animate-pulse text-muted-foreground">...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-3xl py-20 text-center">
        <h2 className="text-xl font-bold text-foreground">Kullanıcı bulunamadı</h2>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.user_id;

  return (
    <div className="container max-w-3xl py-8 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24 text-3xl">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
          <div className="flex justify-center sm:justify-start gap-6 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{followers}</strong> {t(lang, "followers") || "Takipçi"}</span>
            <span><strong className="text-foreground">{following}</strong> {t(lang, "following") || "Takip"}</span>
            <span><strong className="text-foreground">{projects.length}</strong> {t(lang, "projects")}</span>
          </div>
        </div>

        {!isOwnProfile && user && (
          <Button
            onClick={toggleFollow}
            variant={isFollowing ? "outline" : "default"}
            className={!isFollowing ? "gradient-primary text-primary-foreground border-0" : ""}
          >
            {isFollowing ? (
              <>
                <UserMinus className="h-4 w-4 mr-1" /> {t(lang, "unfollow") || "Takibi Bırak"}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" /> {t(lang, "follow") || "Takip Et"}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">{t(lang, "projects")}</h2>
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t(lang, "no_projects")}</p>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{p.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
