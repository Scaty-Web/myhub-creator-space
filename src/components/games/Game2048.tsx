import { useState, useEffect, useCallback } from "react";

type Board = number[][];
const SIZE = 4;

const emptyBoard = (): Board => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (b: Board): Board => {
  const nb = b.map(r => [...r]);
  const empty: [number,number][] = [];
  nb.forEach((r, i) => r.forEach((c, j) => { if (!c) empty.push([i, j]); }));
  if (empty.length) { const [r, c] = empty[Math.floor(Math.random() * empty.length)]; nb[r][c] = Math.random() < 0.9 ? 2 : 4; }
  return nb;
};

const slide = (row: number[]): number[] => {
  const f = row.filter(v => v);
  const merged: number[] = [];
  for (let i = 0; i < f.length; i++) {
    if (i + 1 < f.length && f[i] === f[i + 1]) { merged.push(f[i] * 2); i++; }
    else merged.push(f[i]);
  }
  while (merged.length < SIZE) merged.push(0);
  return merged;
};

const move = (b: Board, dir: string): Board => {
  let nb = b.map(r => [...r]);
  if (dir === "left") nb = nb.map(r => slide(r));
  else if (dir === "right") nb = nb.map(r => slide([...r].reverse()).reverse());
  else if (dir === "up") { for (let c = 0; c < SIZE; c++) { const col = nb.map(r => r[c]); const s = slide(col); s.forEach((v, r) => nb[r][c] = v); } }
  else if (dir === "down") { for (let c = 0; c < SIZE; c++) { const col = nb.map(r => r[c]).reverse(); const s = slide(col).reverse(); s.forEach((v, r) => nb[r][c] = v); } }
  return nb;
};

const boardsEqual = (a: Board, b: Board) => a.every((r, i) => r.every((c, j) => c === b[i][j]));

const tileColor = (v: number) => {
  const m: Record<number, string> = { 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61", 512: "#edc850", 1024: "#edc53f", 2048: "#edc22e" };
  return m[v] || "#3c3a32";
};

const Game2048 = () => {
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(emptyBoard())));
  const [score, setScore] = useState(0);

  const handleMove = useCallback((dir: string) => {
    setBoard(prev => {
      const nb = move(prev, dir);
      if (boardsEqual(prev, nb)) return prev;
      const newScore = nb.flat().reduce((a, b) => a + b, 0);
      setScore(newScore);
      return addRandom(nb);
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, string> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  const reset = () => { setBoard(addRandom(addRandom(emptyBoard()))); setScore(0); };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-foreground font-medium">Skor: {score}</p>
      <div className="bg-[#bbada0] p-2 rounded-lg grid grid-cols-4 gap-2">
        {board.flat().map((v, i) => (
          <div key={i} className="w-16 h-16 rounded flex items-center justify-center font-bold text-lg"
            style={{ background: v ? tileColor(v) : "#cdc1b4", color: v > 4 ? "#f9f6f2" : "#776e65" }}>
            {v || ""}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Yön tuşlarıyla oyna</p>
      <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeniden Başla</button>
    </div>
  );
};
export default Game2048;
