import { useState } from "react";

const GuessNumber = () => {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [msg, setMsg] = useState("1-100 arası bir sayı tahmin et!");
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);

  const check = () => {
    const n = parseInt(guess);
    if (isNaN(n)) return;
    setAttempts(a => a + 1);
    if (n === target) { setMsg(`🎉 Doğru! ${attempts + 1} denemede buldun!`); setWon(true); }
    else if (n < target) setMsg("⬆️ Daha büyük!");
    else setMsg("⬇️ Daha küçük!");
    setGuess("");
  };

  const reset = () => { setTarget(Math.floor(Math.random() * 100) + 1); setGuess(""); setMsg("1-100 arası bir sayı tahmin et!"); setAttempts(0); setWon(false); };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-medium text-foreground">{msg}</p>
      <p className="text-sm text-muted-foreground">Deneme: {attempts}</p>
      <input type="number" value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === "Enter" && check()}
        className="w-32 text-center text-xl p-2 bg-muted rounded-lg text-foreground border border-border" disabled={won} autoFocus />
      {!won && <button onClick={check} disabled={!guess} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Tahmin Et</button>}
      {won && <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Yeni Oyun</button>}
    </div>
  );
};
export default GuessNumber;
