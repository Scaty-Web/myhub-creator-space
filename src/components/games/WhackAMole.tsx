import { useState, useEffect, useRef } from "react";

const WhackAMole = () => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const moleRef = useRef<ReturnType<typeof setInterval>>();

  const start = () => {
    setScore(0); setTimeLeft(30); setPlaying(true);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { setPlaying(false); clearInterval(timerRef.current); clearInterval(moleRef.current); setMoles(Array(9).fill(false)); return 0; } return t - 1; }), 1000);
    moleRef.current = setInterval(() => {
      setMoles(() => { const m = Array(9).fill(false); m[Math.floor(Math.random() * 9)] = true; return m; });
    }, 800);
  };

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(moleRef.current); }, []);

  const whack = (i: number) => { if (moles[i] && playing) { setScore(s => s + 1); setMoles(m => { const n = [...m]; n[i] = false; return n; }); } };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 text-foreground font-medium">
        <span>Skor: {score}</span><span>Süre: {timeLeft}s</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {moles.map((up, i) => (
          <button key={i} onClick={() => whack(i)}
            className={`w-20 h-20 rounded-lg text-3xl flex items-center justify-center transition-all ${up ? "bg-green-500 scale-110" : "bg-muted"}`}>
            {up ? "🐹" : "🕳️"}
          </button>
        ))}
      </div>
      {!playing && <button onClick={start} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">{timeLeft === 0 ? "Tekrar Oyna" : "Başla"}</button>}
    </div>
  );
};
export default WhackAMole;
