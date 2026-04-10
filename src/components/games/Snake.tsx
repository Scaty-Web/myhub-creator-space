import { useState, useEffect, useCallback, useRef } from "react";

const SIZE = 15;
const SPEED = 150;
type Pos = { x: number; y: number };

const Snake = () => {
  const [snake, setSnake] = useState<Pos[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Pos>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const spawnFood = useCallback((s: Pos[]) => {
    let f: Pos;
    do { f = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) }; }
    while (s.some(p => p.x === f.x && p.y === f.y));
    return f;
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Pos> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const d = map[e.key];
      if (d && !(d.x === -dirRef.current.x && d.y === -dirRef.current.y)) {
        setDir(d);
        if (!running && !gameOver) setRunning(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [running, gameOver]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || prev.some(p => p.x === head.x && p.y === head.y)) {
          setRunning(false); setGameOver(true); return prev;
        }
        const ns = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1); setFood(spawnFood(ns));
        } else ns.pop();
        return ns;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [running, food, spawnFood]);

  const reset = () => { setSnake([{ x: 7, y: 7 }]); setDir({ x: 1, y: 0 }); setFood({ x: 5, y: 5 }); setScore(0); setGameOver(false); setRunning(false); };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-foreground font-medium">Skor: {score} {gameOver && "| Game Over!"}</p>
      <div className="grid border border-border rounded" style={{ gridTemplateColumns: `repeat(${SIZE}, 20px)` }}>
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          const isSnake = snake.some(p => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          return <div key={i} className="w-5 h-5" style={{ background: isSnake ? "hsl(var(--primary))" : isFood ? "hsl(var(--destructive))" : "hsl(var(--muted))" }} />;
        })}
      </div>
      <p className="text-sm text-muted-foreground">Yön tuşlarıyla oyna</p>
      {gameOver && <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeniden Başla</button>}
    </div>
  );
};
export default Snake;
