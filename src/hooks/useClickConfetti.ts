import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: "circle" | "rect" | "star";
  rot: number;
  vr: number;
  life: number;
  maxLife: number;
};

const COLORS = [
  "#f8c8d4", // soft pink
  "#e89bb0", // pink
  "#ffffff", // white
  "#fff3d6", // cream
  "#e8c66b", // gold
  "#d4af6a", // shimmer gold
  "#f3d6e3", // blush
  "#c9a4d4", // iridescent lavender
  "#a8d8e8", // iridescent blue
];

export function useClickConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = (x: number, y: number) => {
      const count = 24;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 3 + Math.random() * 4;
        const shapes: Particle["shape"][] = ["circle", "rect", "star"];
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 4 + Math.random() * 5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          life: 0,
          maxLife: 60 + Math.random() * 30,
        });
      }
      if (rafRef.current == null) tick();
    };

    const drawStar = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.45;
        const px = cx + Math.cos(a) * rad;
        const py = cy + Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const arr = particlesRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.life++;
        p.vy += 0.15; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const t = p.life / p.maxLife;
        const alpha = Math.max(0, 1 - t);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          drawStar(0, 0, p.size / 2);
        }
        ctx.restore();
        if (p.life >= p.maxLife || p.y > window.innerHeight + 30) {
          arr.splice(i, 1);
        }
      }
      if (arr.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const onPointer = (e: PointerEvent) => {
      burst(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onPointer);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.remove();
    };
  }, []);
}
