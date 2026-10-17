"use client";

import { useEffect, useRef } from "react";
import { HALFTONE_CELL, bayer } from "@/app/lib/halftone";

const DOT_MAX = HALFTONE_CELL * 0.22;
const FALLOFF = 11;
const FRONT_PX_PER_MS = 0.36;
const DOT = "rgb(68 120 238 / 0.6)";

export interface HaloShape {
  lines: { angle: number; length: number }[];
  frame: number;
  boxes: { x: number; y: number; half: number }[];
}

export default function HalftoneHalo({ shape, size }: { shape: HaloShape; size: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = Math.ceil(size / HALFTONE_CELL);
    const base = new Float32Array(n * n);
    const dist = new Float32Array(n * n);
    const outline = (cx: number, cy: number, half: number, px: number, py: number) =>
      Math.abs(Math.max(Math.abs(px - cx), Math.abs(py - cy)) - half);

    for (let gy = 0; gy < n; gy++) {
      for (let gx = 0; gx < n; gx++) {
        const px = (gx + 0.5) * HALFTONE_CELL - size / 2;
        const py = (gy + 0.5) * HALFTONE_CELL - size / 2;
        let d = outline(0, 0, shape.frame, px, py);
        for (const { angle, length } of shape.lines) {
          const a = (angle * Math.PI) / 180;
          const c = Math.cos(a);
          const s = Math.sin(a);
          const along = Math.min(length, Math.max(0, px * c + py * s));
          d = Math.min(d, Math.hypot(px - along * c, py - along * s));
        }
        for (const { x, y, half } of shape.boxes) d = Math.min(d, outline(x, y, half, px, py));
        const i = gy * n + gx;
        base[i] = d < 3 ? 0 : Math.exp(-(d - 3) / FALLOFF);
        dist[i] = Math.hypot(px, py);
      }
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const ms = now - start;
      const front = ms * FRONT_PX_PER_MS;
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = DOT;
      ctx.beginPath();
      for (let gy = 0; gy < n; gy++) {
        for (let gx = 0; gx < n; gx++) {
          const i = gy * n + gx;
          if (base[i] < 0.02) continue;
          const ramp = Math.min(1, Math.max(0, (front - dist[i]) / 60));
          if (ramp === 0) continue;
          const v = base[i] * ramp * (0.65 + 0.35 * Math.sin(dist[i] / 22 - ms * 0.0022));
          if (v < bayer(gx, gy) * 0.6) continue;
          const r = DOT_MAX * Math.min(1, v * 1.2);
          if (r < 0.4) continue;
          const dx = (gx + 0.5) * HALFTONE_CELL;
          const dy = (gy + 0.5) * HALFTONE_CELL;
          ctx.moveTo(dx + r, dy);
          ctx.arc(dx, dy, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shape, size]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ width: size, height: size, translate: "-50% -50%" }}
    />
  );
}
