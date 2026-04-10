import { useState, useRef, useCallback } from "react";

const COLORS = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];

const SimonSays = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("Başla'ya bas");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const flash = useCallback((seq: number[]) => {
    timeouts.current.forEach(clearTimeout);
    seq.forEach((c, i) => {
      timeouts.current.push(setTimeout(() => setActive(c), i * 600));
      timeouts.current.push(setTimeout(() => setActive(null), i * 600 + 400));
    });
    timeouts.current.push(setTimeout(() => setPlaying(true), seq.length * 600));
  }, []);

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first); setPlayerSeq([]); setScore(0); setMsg("İzle...");
    setPlaying(false);
    flash(first);
  };

  const press = (i: number) => {
    if (!playing) return;
    setActive(i); setTimeout(() => setActive(null), 200);
    const np = [...playerSeq, i]; setPlayerSeq(np);
    if (np[np.length - 1] !== sequence[np.length - 1]) {
      setMsg(`Yanlış! Skor: ${score}`); setPlaying(false); return;
    }
    if (np.length === sequence.length) {
      setScore(s => s + 1); setMsg("Doğru! Sıradaki...");
      setPlaying(false); setPlayerSeq([]);
      const ns = [...sequence, Math.floor(Math.random() * 4)]; setSequence(ns);
      setTimeout(() => flash(ns), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-foreground font-medium">Skor: {score} | {msg}</p>
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((color, i) => (
          <button key={i} onClick={() => press(i)}
            className={`w-24 h-24 rounded-lg transition-all ${color} ${active === i ? "opacity-100 scale-110" : "opacity-50"}`} />
        ))}
      </div>
      {!playing && <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Başla</button>}
    </div>
  );
};
export default SimonSays;
