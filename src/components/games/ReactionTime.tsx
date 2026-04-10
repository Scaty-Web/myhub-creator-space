import { useState, useRef } from "react";

const ReactionTime = () => {
  const [state, setState] = useState<"waiting"|"ready"|"go"|"result">("waiting");
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(Infinity);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const start = () => {
    setState("ready");
    timerRef.current = setTimeout(() => { startRef.current = Date.now(); setState("go"); }, 1000 + Math.random() * 3000);
  };

  const click = () => {
    if (state === "ready") { clearTimeout(timerRef.current); setState("waiting"); return; }
    if (state === "go") {
      const t = Date.now() - startRef.current;
      setTime(t); if (t < best) setBest(t); setState("result");
    }
  };

  const colors = { waiting: "bg-muted", ready: "bg-destructive/60", go: "bg-green-500", result: "bg-primary/30" };

  return (
    <div className="flex flex-col items-center gap-4">
      {best < Infinity && <p className="text-foreground font-medium">En iyi: {best}ms</p>}
      <button onClick={state === "waiting" || state === "result" ? start : click}
        className={`w-64 h-48 rounded-xl text-xl font-bold text-foreground flex items-center justify-center transition-colors ${colors[state]}`}>
        {state === "waiting" && "Başlamak için tıkla"}
        {state === "ready" && "Yeşil olunca tıkla... (Erken tıklama!)"}
        {state === "go" && "ŞİMDİ TIKLA!"}
        {state === "result" && `${time}ms! Tekrar dene`}
      </button>
    </div>
  );
};
export default ReactionTime;
