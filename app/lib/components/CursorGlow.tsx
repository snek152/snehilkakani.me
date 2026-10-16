"use client";

import { useEffect, useRef } from "react";
import { useCursorField } from "@/app/lib/components/shared/CursorField";
import { HALFTONE_CELL, bayer } from "@/app/lib/halftone";

const CELL = HALFTONE_CELL;
const REACH = 150;
const MAX_DOT = CELL * 0.3;
const MIN_DOT = 0.4;
const DOT_ALPHA = 0.22;
const FALLOFF = 1.8;
const DITHER_DEPTH = 0.6;

export default function CursorGlow() {
  const { x, y, active } = useCursorField();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { desynchronized: true });
    if (!canvas || !ctx) return;

    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-rgb")
      .trim()
      .split(/\s+/)
      .join(", ");
    const fill = `rgba(${rgb}, ${DOT_ALPHA})`;

    let width = 0;
    let height = 0;
    let rafId: number | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = fill;
    };

    const draw = () => {
      rafId = null;
      ctx.clearRect(0, 0, width, height);
      const cx = x.get();
      const cy = y.get();
      const c0 = Math.max(0, Math.floor((cx - REACH) / CELL));
      const c1 = Math.min(Math.ceil(width / CELL), Math.ceil((cx + REACH) / CELL));
      const r0 = Math.max(0, Math.floor((cy - REACH) / CELL));
      const r1 = Math.min(Math.ceil(height / CELL), Math.ceil((cy + REACH) / CELL));
      ctx.beginPath();
      for (let r = r0; r < r1; r++) {
        const py = (r + 0.5) * CELL;
        for (let c = c0; c < c1; c++) {
          const px = (c + 0.5) * CELL;
          const d = Math.hypot(px - cx, py - cy) / REACH;
          if (d >= 1) continue;
          const falloff = Math.pow(1 - d, FALLOFF);
          if (falloff < bayer(c, r) * DITHER_DEPTH) continue;
          const radius = MAX_DOT * Math.min(1, falloff * 1.3);
          if (radius < MIN_DOT) continue;
          ctx.moveTo(px + radius, py);
          ctx.arc(px, py, radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(draw);
    };

    resize();
    schedule();
    const offX = x.on("change", schedule);
    const offY = y.on("change", schedule);
    window.addEventListener("resize", resize);

    return () => {
      offX();
      offY();
      window.removeEventListener("resize", resize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
