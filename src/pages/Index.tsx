import { Link } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Rocket, Share2, Users, Sparkles, Code, Gamepad2 } from "lucide-react";

const features = [
  { icon: Share2, color: "text-primary", key: "share" },
  { icon: Users, color: "text-peach", key: "chatroom" },
  { icon: Gamepad2, color: "text-success", key: "games" },
  { icon: Code, color: "text-sapphire", key: "ai_chat" },
];

const Index = () => {
  const { lang } = useAppStore();

  return (
    <div className="flex flex-col">
      {/* Info Banner */}
      <div className="gradient-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
        <Sparkles className="inline h-4 w-4 mr-1 -mt-0.5" />
        {t(lang, "info_desc")}
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-accent blur-[100px]" />
        </div>

        <div className="relative z-10 animate-fade-in space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-4">
            <Rocket className="h-4 w-4 text-peach" />
            Scratch Community Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-gradient">MYHUB</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            {t(lang, "welcome_subtitle")}
          </p>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t(lang, "welcome_desc")}
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 hover:opacity-90 px-8">
              <Link to="/projects">{t(lang, "explore")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border hover:bg-secondary">
              <Link to="/share">{t(lang, "share_project")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, color, key }) => (
            <Link
              key={key}
              to={key === "share" ? "/share" : key === "chatroom" ? "/chat" : key === "games" ? "/games" : "/ai"}
              className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/40 transition-all hover:-translate-y-1 group"
            >
              <Icon className={`h-8 w-8 mx-auto mb-3 ${color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-foreground">{t(lang, key)}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
