import { useState, useCallback } from "react";

type Cell = "X" | "O" | null;
const winLines = [
  [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
];

const checkWinner = (b: Cell[]): Cell => {
  for (const [a,c,d] of winLines) if (b[a] && b[a]===b[c] && b[a]===b[d]) return b[a];
  return null;
};

const minimax = (board: Cell[], isMax: boolean): number => {
  const w = checkWinner(board);
  if (w === "O") return 10;
  if (w === "X") return -10;
  if (board.every(c => c)) return 0;
  const scores = board.map((c, i) => {
    if (c) return isMax ? -Infinity : Infinity;
    const nb = [...board]; nb[i] = isMax ? "O" : "X";
    return minimax(nb, !isMax);
  }).filter(s => s !== (isMax ? -Infinity : Infinity));
  return isMax ? Math.max(...scores) : Math.min(...scores);
};

const TicTacToe = () => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("Senin sıran (X)");

  const aiMove = useCallback((b: Cell[]) => {
    let bestScore = -Infinity, bestIdx = 0;
    b.forEach((c, i) => {
      if (c) return;
      const nb = [...b]; nb[i] = "O";
      const score = minimax(nb, false);
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    const nb = [...b]; nb[bestIdx] = "O";
    const w = checkWinner(nb);
    if (w) { setStatus("AI kazandı! 🤖"); setGameOver(true); }
    else if (nb.every(c => c)) { setStatus("Berabere! 🤝"); setGameOver(true); }
    else setStatus("Senin sıran (X)");
    setBoard(nb);
  }, []);

  const handleClick = (i: number) => {
    if (board[i] || gameOver) return;
    const nb = [...board]; nb[i] = "X";
    setBoard(nb);
    const w = checkWinner(nb);
    if (w) { setStatus("Sen kazandın! 🎉"); setGameOver(true); return; }
    if (nb.every(c => c)) { setStatus("Berabere! 🤝"); setGameOver(true); return; }
    setStatus("AI düşünüyor... 🤔");
    setTimeout(() => aiMove(nb), 300);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setGameOver(false); setStatus("Senin sıran (X)"); };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-medium text-foreground">{status}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className="w-20 h-20 bg-muted rounded-lg text-3xl font-bold flex items-center justify-center hover:bg-muted/70 transition-colors"
            style={{ color: cell === "X" ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
            {cell}
          </button>
        ))}
      </div>
      <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeniden Başla</button>
    </div>
  );
};
export default TicTacToe;
