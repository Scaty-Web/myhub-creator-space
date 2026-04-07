import { Link, useLocation } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import LangSwitcher from "./LangSwitcher";
import { Home, FolderOpen, Share2, MessageCircle, Gamepad2, Bot, LogIn, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { key: "home", path: "/", icon: Home },
  { key: "projects", path: "/projects", icon: FolderOpen },
  { key: "share", path: "/share", icon: Share2 },
  { key: "chatroom", path: "/chat", icon: MessageCircle },
  { key: "games", path: "/games", icon: Gamepad2 },
  { key: "ai_chat", path: "/ai", icon: Bot },
];

const Navbar = () => {
  const { lang } = useAppStore();
  const { user, username, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-gradient">MYHUB</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">DEVELOP SPACE</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ key, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={key}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{t(lang, key)}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                <User className="inline h-3.5 w-3.5 mr-1" />
                {username}
              </span>
              <Link to="/settings" className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary transition-colors">
                <Settings className="h-4 w-4" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline ml-1">{t(lang, "logout")}</span>
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                <span className="hidden md:inline ml-1">{t(lang, "login")}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
