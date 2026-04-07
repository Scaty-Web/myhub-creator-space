import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

function extractScratchId(link: string): string | null {
  const match = link.match(/scratch\.mit\.edu\/projects\/(\d+)/);
  if (match) return match[1];
  const numOnly = link.trim();
  if (/^\d+$/.test(numOnly)) return numOnly;
  return null;
}

const ShareProject = () => {
  const { lang } = useAppStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const scratchId = extractScratchId(link);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t(lang, "login_required"));
      navigate("/auth");
      return;
    }
    if (!name.trim() || !scratchId) return;

    setLoading(true);
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name: name.trim(),
      description: desc.trim(),
      scratch_id: scratchId,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t(lang, "project_shared"));
      navigate("/projects");
    }
    setLoading(false);
  };

  return (
    <div className="container max-w-xl py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <Share2 className="h-10 w-10 mx-auto text-primary" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "share_project")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "project_name")}</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "project_desc")}</label>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-secondary border-border min-h-[80px]" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "scratch_link")}</label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={t(lang, "scratch_link_placeholder")}
            className="bg-secondary border-border"
            required
          />
          {link && !scratchId && (
            <p className="text-xs text-destructive">Geçersiz link / Invalid link</p>
          )}
        </div>

        {scratchId && (
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe
              src={`https://ilgazmod.vercel.app/embed.html#${scratchId}`}
              width="100%"
              height="320"
              allowFullScreen
              className="border-0"
              title="Preview"
            />
          </div>
        )}

        <Button type="submit" disabled={!name.trim() || !scratchId || loading} className="w-full gradient-primary text-primary-foreground border-0">
          {loading ? "..." : t(lang, "publish")}
        </Button>
      </form>
    </div>
  );
};

export default ShareProject;
