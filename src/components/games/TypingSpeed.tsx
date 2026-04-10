import { useState, useRef } from "react";

const words = ["merhaba","dünya","bilgisayar","oyun","programlama","scratch","proje","topluluk","arkadaş","eğlence","müzik","sanat","tasarım","yıldız","güneş","ay","deniz","dağ","orman","çiçek"];

const TypingSpeed = () => {
  const [target, setTarget] = useState(() => Array.from({ length: 5 }, () => words[Math.floor(Math.random() * words.length)]).join(" "));
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState("");
  const startTime = useRef(0);

  const handleChange = (val: string) => {
    if (!started) { startTime.current = Date.now(); setStarted(true); }
    setInput(val);
    if (val === target) {
      const secs = (Date.now() - startTime.current) / 1000;
      const wpm = Math.round((target.split(" ").length / secs) * 60);
      setResult(`${secs.toFixed(1)} saniye | ${wpm} WPM`);
      setStarted(false);
    }
  };

  const reset = () => {
    setTarget(Array.from({ length: 5 }, () => words[Math.floor(Math.random() * words.length)]).join(" "));
    setInput(""); setResult(""); setStarted(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-md">
      <p className="text-lg font-mono text-foreground bg-muted p-3 rounded-lg tracking-wide">{target}</p>
      <input value={input} onChange={e => handleChange(e.target.value)} placeholder="Yazmaya başla..."
        className="w-full p-2 bg-muted rounded-lg text-foreground border border-border font-mono" disabled={!!result} autoFocus />
      {result && <p className="text-lg font-bold text-foreground">{result}</p>}
      <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeni Kelimeler</button>
    </div>
  );
};
export default TypingSpeed;
