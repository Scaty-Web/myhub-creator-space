import { useState, useCallback } from "react";

const colors = [
  { name: "Kırmızı", hex: "#ef4444" },
  { name: "Mavi", hex: "#3b82f6" },
  { name: "Yeşil", hex: "#22c55e" },
  { name: "Sarı", hex: "#eab308" },
  { name: "Mor", hex: "#a855f7" },
  { name: "Turuncu", hex: "#f97316" },
];

const ColorMatch = () => {
  const gen = useCallback(() => {
    const word = colors[Math.floor(Math.random() * colors.length)];
    const display = colors[Math.floor(Math.random() * colors.length)];
    const opts = [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!opts.find(o => o.hex === display.hex)) opts[0] = display;
    return { word, display, opts: opts.sort(() => Math.random() - 0.5) };
  }, []);

  const [round, setRound] = useState(gen);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState("");

  const pick = (hex: string) => {
    setTotal(t => t + 1);
    if (hex === round.display.hex) { setScore(s => s + 1); setFeedback("Doğru! ✅"); }
    else setFeedback("Yanlış! ❌");
    setTimeout(() => { setRound(gen()); setFeedback(""); }, 600);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-foreground font-medium">Skor: {score}/{total}</p>
      <p className="text-sm text-muted-foreground">Yazının RENGİNİ seç (kelimeyi değil!)</p>
      <p className="text-4xl font-bold" style={{ color: round.display.hex }}>{round.word.name}</p>
      <div className="flex gap-3">
        {round.opts.map(c => (
          <button key={c.hex} onClick={() => pick(c.hex)} className="w-16 h-16 rounded-lg border-2 border-border hover:scale-110 transition-transform" style={{ background: c.hex }} />
        ))}
      </div>
      {feedback && <p className="text-lg font-medium text-foreground">{feedback}</p>}
    </div>
  );
};
export default ColorMatch;
