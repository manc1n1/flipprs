import { useEffect, useRef } from 'react';

type TSpinnerProps = {
  size?: number;
};

const DRAW_SIZE = 64;

function getCol(alpha: number): string {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue('--spinner-rgb')
    .trim();

  return `rgba(${rgb || '148, 148, 148'}, ${alpha})`;
}

function draw(ctx: CanvasRenderingContext2D, time: number) {
  ctx.clearRect(0, 0, DRAW_SIZE, DRAW_SIZE);

  const centerX = DRAW_SIZE / 2;
  const centerY = DRAW_SIZE / 2;
  const scale = 2;

  const crabOffsetX = Math.round(Math.sin(time * 0.003) * 4);
  const crabBobY = Math.round(Math.sin(time * 0.008) * 1);

  const px = (x: number, y: number, alpha: number) => {
    ctx.fillStyle = getCol(alpha);
    ctx.fillRect(
      Math.round(centerX + (x + crabOffsetX) * scale),
      Math.round(centerY + (y + crabBobY) * scale),
      scale,
      scale,
    );
  };

  [
    [-4, 0],
    [-3, 0],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [-4, -1],
    [-3, -1],
    [-2, -1],
    [-1, -1],
    [0, -1],
    [1, -1],
    [2, -1],
    [3, -1],
    [4, -1],
    [-4, 1],
    [-3, 1],
    [-2, 1],
    [-1, 1],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [-3, -2],
    [-2, -2],
    [-1, -2],
    [0, -2],
    [1, -2],
    [2, -2],
    [3, -2],
    [-3, 2],
    [-2, 2],
    [-1, 2],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ].forEach(([x, y]) => px(x, y, 0.62));

  px(-1, -3, 0.72);
  px(1, -3, 0.72);
  px(-1, -2, 0.58);
  px(1, -2, 0.58);

  if (Math.floor(time / 2800) % 6 === 0 && time % 2800 < 160) {
    ctx.fillStyle = getCol(0.5);
    ctx.fillRect(
      Math.round(centerX + (crabOffsetX - 1.5) * scale),
      Math.round(centerY + (crabBobY - 3) * scale),
      2 * scale,
      Math.max(1, Math.round(0.4 * scale)),
    );
  } else {
    px(-1, -3, 0.92);
    px(1, -3, 0.92);
  }

  const swing = Math.round(1.5 * Math.sin(0.0018 * time));

  [
    [-5, -2],
    [-6, -2],
    [-6, -1],
    [-5, -1],
    [-6, -3],
    [-7, -2],
  ].forEach(([x, y]) => px(x, y, 0.65));

  px(-7, -1 + swing, 0.55);
  px(-7, -3 - swing, 0.45);

  [
    [5, -2],
    [6, -2],
    [6, -1],
    [5, -1],
    [6, -3],
    [7, -2],
  ].forEach(([x, y]) => px(x, y, 0.65));

  px(7, -1 + swing, 0.55);
  px(7, -3 - swing, 0.45);

  [
    [-5, 0],
    [-4, -1],
  ].forEach(([x, y]) => px(x, y, 0.58));

  [
    [5, 0],
    [4, -1],
  ].forEach(([x, y]) => px(x, y, 0.58));

  const phase = 0.003 * time;

  [
    { bx: -4, by: 2, phase },
    { bx: -3, by: 2, phase: phase + 0.5 * Math.PI },
    { bx: -2, by: 2, phase: phase + Math.PI },
    { bx: -1, by: 2, phase: phase + 1.5 * Math.PI },
    { bx: 1, by: 2, phase },
    { bx: 2, by: 2, phase: phase + 0.5 * Math.PI },
    { bx: 3, by: 2, phase: phase + Math.PI },
    { bx: 4, by: 2, phase: phase + 1.5 * Math.PI },
  ].forEach(({ bx, by, phase }) => {
    const intensity = Math.abs(Math.sin(phase));
    const dir = bx < 0 ? -1 : 1;

    const legX = bx + dir * Math.round(1 + intensity);
    const legY = by + Math.round(1.2 * Math.sin(phase));

    px(bx, by, 0.52);
    px(legX, legY, 0.42 + 0.2 * intensity);

    if (intensity > 0.5) {
      px(legX + dir, legY + 1, 0.28);
    }
  });
}

export default function Spinner({ size = 128 }: TSpinnerProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = DRAW_SIZE * dpr;
    canvas.height = DRAW_SIZE * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const startTime = performance.now();
    let rafId = 0;

    const loop = () => {
      draw(ctx, performance.now() - startTime);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={ref}
      width={DRAW_SIZE}
      height={DRAW_SIZE}
      role='status'
      aria-live='polite'
      aria-label='Loading'
      style={{
        width: size,
        height: size,
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  );
}
