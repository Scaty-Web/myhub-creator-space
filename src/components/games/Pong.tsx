import { useEffect, useRef, useState } from "react";

const W = 400, H = 300, PW = 10, PH = 60, BALL = 8;

const Pong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState({ p: 0, ai: 0 });
  const state = useRef({ py: H/2, ay: H/2, bx: W/2, by: H/2, bdx: 3, bdy: 2, running: true });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = state.current;

    const handler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      s.py = Math.max(PH/2, Math.min(H - PH/2, e.clientY - rect.top));
    };
    canvas.addEventListener("mousemove", handler);

    const loop = setInterval(() => {
      // AI
      if (s.ay < s.by - 10) s.ay += 2.5; else if (s.ay > s.by + 10) s.ay -= 2.5;
      // Ball
      s.bx += s.bdx; s.by += s.bdy;
      if (s.by <= BALL || s.by >= H - BALL) s.bdy *= -1;
      // Paddle collisions
      if (s.bx <= PW + BALL && s.by > s.py - PH/2 && s.by < s.py + PH/2) s.bdx = Math.abs(s.bdx);
      if (s.bx >= W - PW - BALL && s.by > s.ay - PH/2 && s.by < s.ay + PH/2) s.bdx = -Math.abs(s.bdx);
      // Score
      if (s.bx < 0) { setScores(sc => ({ ...sc, ai: sc.ai + 1 })); s.bx = W/2; s.by = H/2; s.bdx = 3; }
      if (s.bx > W) { setScores(sc => ({ ...sc, p: sc.p + 1 })); s.bx = W/2; s.by = H/2; s.bdx = -3; }
      // Draw
      ctx.fillStyle = "hsl(222, 47%, 11%)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "hsl(210, 40%, 96%)";
      ctx.fillRect(2, s.py - PH/2, PW, PH);
      ctx.fillRect(W - PW - 2, s.ay - PH/2, PW, PH);
      ctx.beginPath(); ctx.arc(s.bx, s.by, BALL, 0, Math.PI * 2); ctx.fill();
      ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.strokeStyle = "hsl(210, 40%, 40%)"; ctx.stroke(); ctx.setLineDash([]);
    }, 16);

    return () => { clearInterval(loop); canvas.removeEventListener("mousemove", handler); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-foreground font-medium">Sen: {scores.p} | AI: {scores.ai}</p>
      <canvas ref={canvasRef} width={W} height={H} className="rounded-lg border border-border cursor-none" />
      <p className="text-sm text-muted-foreground">Fareyi kullanarak oyna</p>
    </div>
  );
};
export default Pong;
