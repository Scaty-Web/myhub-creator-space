import { Link, useLocation } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import LangSwitcher from "./LangSwitcher";
import { Home, FolderOpen, Share2, MessageCircle, Gamepad2, Bot } from "lucide-react";

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

        <LangSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
