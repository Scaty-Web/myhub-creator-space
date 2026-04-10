import { useState } from "react";

const choices = ["✊","✋","✌️"];
const names = ["Taş","Kağıt","Makas"];

const RockPaperScissors = () => {
  const [result, setResult] = useState("");
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [playerChoice, setPlayerChoice] = useState("");
  const [aiChoice, setAiChoice] = useState("");

  const play = (pi: number) => {
    const ai = Math.floor(Math.random() * 3);
    setPlayerChoice(choices[pi]); setAiChoice(choices[ai]);
    if (pi === ai) setResult("Berabere! 🤝");
    else if ((pi + 1) % 3 === ai) { setResult("Kaybettin! 😢"); setScores(s => ({ ...s, ai: s.ai + 1 })); }
    else { setResult("Kazandın! 🎉"); setScores(s => ({ ...s, player: s.player + 1 })); }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-foreground font-medium">Sen: {scores.player} | AI: {scores.ai}</p>
      <div className="flex gap-4">
        {choices.map((c, i) => (
          <button key={i} onClick={() => play(i)} className="w-20 h-20 bg-muted rounded-lg text-4xl hover:bg-muted/70 transition-colors flex items-center justify-center">
            {c}
          </button>
        ))}
      </div>
      {playerChoice && (
        <div className="text-center space-y-1">
          <p className="text-foreground">Sen: {playerChoice} vs AI: {aiChoice}</p>
          <p className="text-lg font-bold text-foreground">{result}</p>
        </div>
      )}
    </div>
  );
};
export default RockPaperScissors;
