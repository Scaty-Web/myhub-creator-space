import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings, User, Phone, AlertTriangle, Shield } from "lucide-react";

const AccountSettings = () => {
  const { lang } = useAppStore();
  const { user, username, signOut } = useAuth();
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState(username ?? "");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (username) setNewUsername(username);
  }, [username]);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const saveProfile = async () => {
    if (!newUsername.trim() || newUsername.length < 3) {
      toast.error(t(lang, "username_min"));
      return;
    }
    setSaving(true);

    // Check if username taken by someone else
    if (newUsername !== username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", newUsername.trim())
        .neq("user_id", user.id)
        .single();

      if (existing) {
        toast.error(t(lang, "username_taken"));
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: newUsername.trim() })
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t(lang, "profile_saved"));
    }
    setSaving(false);
  };

  const savePhone = async () => {
    if (!phone.trim()) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ phone: phone.trim() });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t(lang, "phone_saved"));
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== username) return;
    // Delete user's projects and profile, then sign out
    await supabase.from("project_likes").delete().eq("user_id", user.id);
    await supabase.from("projects").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("user_id", user.id);
    await signOut();
    toast.success(t(lang, "account_deleted"));
    navigate("/");
  };

  return (
    <div className="container max-w-xl py-12 space-y-8 animate-fade-in">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "account_settings")}</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{t(lang, "profile")}</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "email")}</label>
          <Input value={user.email ?? ""} disabled className="bg-muted border-border opacity-60" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "username")}</label>
          <Input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="bg-secondary border-border"
            minLength={3}
          />
        </div>

        <Button onClick={saveProfile} disabled={saving} className="gradient-primary text-primary-foreground border-0">
          {saving ? "..." : t(lang, "save")}
        </Button>
      </div>

      {/* Phone Section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{t(lang, "phone_number")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{t(lang, "phone_desc")}</p>

        <div className="space-y-2">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 555 123 4567"
            className="bg-secondary border-border"
          />
        </div>

        <Button onClick={savePhone} disabled={saving || !phone.trim()} variant="outline" className="border-border">
          {saving ? "..." : t(lang, "save")}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">{t(lang, "danger_zone")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{t(lang, "delete_warning")}</p>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            {t(lang, "type_username_confirm").replace("{username}", username ?? "")}
          </label>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            className="bg-secondary border-destructive/30"
            placeholder={username ?? ""}
          />
        </div>

        <Button
          onClick={handleDeleteAccount}
          disabled={deleteConfirm !== username}
          variant="destructive"
          className="w-full"
        >
          <Shield className="h-4 w-4 mr-2" />
          {t(lang, "delete_account")}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
