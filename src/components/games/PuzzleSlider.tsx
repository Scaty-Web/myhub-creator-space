import { useState, useCallback } from "react";

const SIZE = 3;
const TOTAL = SIZE * SIZE;

const shuffle = (): number[] => {
  let arr = Array.from({ length: TOTAL }, (_, i) => i); // 0 = empty
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
};

const isSolvable = (arr: number[]) => {
  let inv = 0;
  for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
  return inv % 2 === 0;
};

const initBoard = () => { let b = shuffle(); while (!isSolvable(b)) b = shuffle(); return b; };
const isWon = (b: number[]) => b.every((v, i) => v === (i + 1) % TOTAL);

const PuzzleSlider = () => {
  const [board, setBoard] = useState(initBoard);
  const [moves, setMoves] = useState(0);

  const click = useCallback((i: number) => {
    const ei = board.indexOf(0);
    const er = Math.floor(ei / SIZE), ec = ei % SIZE;
    const cr = Math.floor(i / SIZE), cc = i % SIZE;
    if (Math.abs(er - cr) + Math.abs(ec - cc) !== 1) return;
    const nb = [...board]; [nb[ei], nb[i]] = [nb[i], nb[ei]];
    setBoard(nb); setMoves(m => m + 1);
  }, [board]);

  const reset = () => { setBoard(initBoard()); setMoves(0); };
  const won = isWon(board);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-foreground font-medium">Hamle: {moves} {won && "| Kazandın! 🎉"}</p>
      <div className="grid grid-cols-3 gap-1">
        {board.map((v, i) => (
          <button key={i} onClick={() => click(i)}
            className={`w-20 h-20 rounded-lg text-2xl font-bold flex items-center justify-center transition-all ${v === 0 ? "bg-transparent" : "bg-primary text-primary-foreground hover:bg-primary/80"}`}>
            {v || ""}
          </button>
        ))}
      </div>
      <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Karıştır</button>
    </div>
  );
};
export default PuzzleSlider;
