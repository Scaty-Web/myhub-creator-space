import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Gamepad2 } from "lucide-react";

const games = [
  { name: "🐱 Scratch Cat Runner", scratchId: "10128407" },
  { name: "🎵 Music Maker", scratchId: "1032956" },
  { name: "🚀 Space Adventure", scratchId: "104" },
];

const MiniGames = () => {
  const { lang } = useAppStore();

  return (
    <div className="container py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Gamepad2 className="h-6 w-6 text-success" />
        <h1 className="text-2xl font-bold text-foreground">{t(lang, "games")}</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.scratchId} className="bg-card border border-border rounded-lg overflow-hidden hover:border-success/40 transition-colors">
            <iframe
              src={`https://ilgazmod.vercel.app/embed.html#${game.scratchId}`}
              width="100%"
              height="320"
              allowFullScreen
              className="border-0"
              title={game.name}
            />
            <div className="p-3 text-center font-medium text-foreground">{game.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniGames;
