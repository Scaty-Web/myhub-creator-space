import { useState, useEffect } from "react";

const emojis = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"];
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const MemoryCard = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => { setCards(shuffle([...emojis, ...emojis])); }, []);

  const handleClick = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves(m => m + 1);
      if (cards[nf[0]] === cards[nf[1]]) {
        setMatched(m => [...m, ...nf]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const reset = () => { setCards(shuffle([...emojis, ...emojis])); setFlipped([]); setMatched([]); setMoves(0); };
  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-foreground font-medium">Hamle: {moves} {won && "| Kazandın! 🎉"}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((emoji, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`w-16 h-16 rounded-lg text-2xl flex items-center justify-center transition-all ${flipped.includes(i) || matched.includes(i) ? "bg-primary/20" : "bg-muted hover:bg-muted/70"}`}>
            {(flipped.includes(i) || matched.includes(i)) ? emoji : "❓"}
          </button>
        ))}
      </div>
      <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeniden Başla</button>
    </div>
  );
};
export default MemoryCard;
