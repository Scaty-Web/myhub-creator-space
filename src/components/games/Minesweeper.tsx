import { useState, useCallback } from "react";

const ROWS = 8, COLS = 8, MINES = 10;
type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adj: number };

const createBoard = (): Cell[][] => {
  const b: Cell[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
    if (!b[r][c].mine) { b[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (b[r][c].mine) continue;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine) count++;
    }
    b[r][c].adj = count;
  }
  return b;
};

const Minesweeper = () => {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const reveal = useCallback((b: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || b[r][c].revealed || b[r][c].flagged) return;
    b[r][c].revealed = true;
    if (b[r][c].adj === 0 && !b[r][c].mine) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(b, r+dr, c+dc);
    }
  }, []);

  const click = (r: number, c: number) => {
    if (gameOver || won || board[r][c].flagged) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    if (nb[r][c].mine) { nb.forEach(row => row.forEach(cell => cell.revealed = true)); setBoard(nb); setGameOver(true); return; }
    reveal(nb, r, c);
    const unrevealed = nb.flat().filter(c => !c.revealed).length;
    if (unrevealed === MINES) setWon(true);
    setBoard(nb);
  };

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    const nb = board.map(row => row.map(cell => ({ ...cell }))); nb[r][c].flagged = !nb[r][c].flagged; setBoard(nb);
  };

  const reset = () => { setBoard(createBoard()); setGameOver(false); setWon(false); };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-foreground font-medium">{gameOver ? "💥 Mayına bastın!" : won ? "🎉 Kazandın!" : "🚩 Sağ tık = bayrak"}</p>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, 32px)` }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => click(r, c)} onContextMenu={e => flag(e, r, c)}
            className={`w-8 h-8 text-sm font-bold flex items-center justify-center rounded-sm ${cell.revealed ? "bg-muted" : "bg-primary/30 hover:bg-primary/40"}`}>
            {cell.revealed ? (cell.mine ? "💣" : cell.adj || "") : cell.flagged ? "🚩" : ""}
          </button>
        )))}
      </div>
      <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeniden Başla</button>
    </div>
  );
};
export default Minesweeper;
