import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Lock, AtSign } from "lucide-react";

const Auth = () => {
  const { lang } = useAppStore();
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success(t(lang, "login_success"));
        navigate("/");
      }
    } else {
      if (!username.trim() || username.length < 3) {
        toast.error(t(lang, "username_min"));
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, username.trim());
      if (error) {
        if (error === "username_taken") {
          toast.error(t(lang, "username_taken"));
        } else {
          toast.error(error);
        }
      } else {
        toast.success(t(lang, "signup_success"));
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container max-w-md py-16 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <User className="h-10 w-10 mx-auto text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          {isLogin ? t(lang, "login") : t(lang, "signup")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t(lang, "username")}</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 bg-secondary border-border"
                placeholder={t(lang, "username")}
                required
                minLength={3}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "email")}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 bg-secondary border-border"
              placeholder={t(lang, "email")}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t(lang, "password")}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 bg-secondary border-border"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gradient-primary text-primary-foreground border-0"
        >
          {loading ? "..." : isLogin ? t(lang, "login") : t(lang, "signup")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? t(lang, "no_account") : t(lang, "has_account")}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? t(lang, "signup") : t(lang, "login")}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
