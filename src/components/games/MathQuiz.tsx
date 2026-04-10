import { useState, useCallback } from "react";

const MathQuiz = () => {
  const gen = useCallback(() => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * 3)];
    let a = Math.floor(Math.random() * 20) + 1, b = Math.floor(Math.random() * 20) + 1;
    if (op === "-" && a < b) [a, b] = [b, a];
    const ans = op === "+" ? a + b : op === "-" ? a - b : a * b;
    return { q: `${a} ${op} ${b} = ?`, ans };
  }, []);

  const [problem, setProblem] = useState(gen);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState("");

  const check = () => {
    setTotal(t => t + 1);
    if (parseInt(input) === problem.ans) {
      setScore(s => s + 1); setFeedback("Doğru! ✅");
    } else setFeedback(`Yanlış! Cevap: ${problem.ans} ❌`);
    setTimeout(() => { setProblem(gen()); setInput(""); setFeedback(""); }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-foreground font-medium">Skor: {score}/{total}</p>
      <p className="text-3xl font-bold text-foreground">{problem.q}</p>
      <input type="number" value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && input && check()}
        className="w-32 text-center text-xl p-2 bg-muted rounded-lg text-foreground border border-border" autoFocus />
      <button onClick={check} disabled={!input} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Kontrol Et</button>
      {feedback && <p className="text-lg font-medium text-foreground">{feedback}</p>}
    </div>
  );
};
export default MathQuiz;
