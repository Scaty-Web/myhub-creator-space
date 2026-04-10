import { useState, lazy, Suspense } from "react";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Gamepad2, ArrowLeft } from "lucide-react";

const gameList = [
  { id: "tictactoe", name: "❌ TicTacToe (vs AI)", desc: "Yapay zekaya karşı oyna" },
  { id: "snake", name: "🐍 Yılan", desc: "Klasik yılan oyunu" },
  { id: "memory", name: "🃏 Hafıza Kartları", desc: "Eşleşen kartları bul" },
  { id: "rps", name: "✊ Taş Kağıt Makas", desc: "AI'ya karşı şansını dene" },
  { id: "reaction", name: "⚡ Reaksiyon Testi", desc: "Ne kadar hızlısın?" },
  { id: "math", name: "🧮 Matematik Quiz", desc: "Hızlı matematik soruları" },
  { id: "color", name: "🎨 Renk Eşleştirme", desc: "Doğru rengi seç" },
  { id: "whack", name: "🐹 Köstebek Vur", desc: "30 saniyede kaç vurabilirsin?" },
  { id: "typing", name: "⌨️ Yazma Hızı", desc: "Hızlı yazma testi" },
  { id: "pong", name: "🏓 Pong", desc: "Klasik Pong oyunu" },
  { id: "2048", name: "🔢 2048", desc: "Sayıları birleştir" },
  { id: "minesweeper", name: "💣 Mayın Tarlası", desc: "Mayınlardan kaçın" },
  { id: "simon", name: "🔴 Simon Says", desc: "Sırayı hatırla" },
  { id: "puzzle", name: "🧩 Puzzle Slider", desc: "Kaydırmalı bulmaca" },
  { id: "guess", name: "🔮 Sayı Tahmin", desc: "1-100 arası sayıyı bul" },
];

const components: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  tictactoe: lazy(() => import("@/components/games/TicTacToe")),
  snake: lazy(() => import("@/components/games/Snake")),
  memory: lazy(() => import("@/components/games/MemoryCard")),
  rps: lazy(() => import("@/components/games/RockPaperScissors")),
  reaction: lazy(() => import("@/components/games/ReactionTime")),
  math: lazy(() => import("@/components/games/MathQuiz")),
  color: lazy(() => import("@/components/games/ColorMatch")),
  whack: lazy(() => import("@/components/games/WhackAMole")),
  typing: lazy(() => import("@/components/games/TypingSpeed")),
  pong: lazy(() => import("@/components/games/Pong")),
  "2048": lazy(() => import("@/components/games/Game2048")),
  minesweeper: lazy(() => import("@/components/games/Minesweeper")),
  simon: lazy(() => import("@/components/games/SimonSays")),
  puzzle: lazy(() => import("@/components/games/PuzzleSlider")),
  guess: lazy(() => import("@/components/games/GuessNumber")),
};

const MiniGames = () => {
  const { lang } = useAppStore();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const ActiveComponent = activeGame ? components[activeGame] : null;

  return (
    <div className="container py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        {activeGame && (
          <button onClick={() => setActiveGame(null)} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
        )}
        <Gamepad2 className="h-6 w-6 text-success" />
        <h1 className="text-2xl font-bold text-foreground">
          {activeGame ? gameList.find(g => g.id === activeGame)?.name : t(lang, "games")}
        </h1>
      </div>

      {activeGame && ActiveComponent ? (
        <div className="flex justify-center py-8">
          <Suspense fallback={<div className="text-muted-foreground">Yükleniyor...</div>}>
            <ActiveComponent />
          </Suspense>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {gameList.map(game => (
            <button key={game.id} onClick={() => setActiveGame(game.id)}
              className="bg-card border border-border rounded-lg p-4 hover:border-success/40 transition-all hover:scale-105 text-left space-y-1">
              <p className="text-lg font-medium text-foreground">{game.name}</p>
              <p className="text-xs text-muted-foreground">{game.desc}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MiniGames;
