"use client";

import { useEffect, useRef } from "react";
import { HALFTONE_CELL, bayer } from "@/app/lib/halftone";

const BG = 0xff080808;
const ACCENT = 0x66eb6325;
const BAND = 0.04;
const DELAY = 0.45;
const RADIAL = 0.6;
const CELL = HALFTONE_CELL / 2;

export default function DitherReveal({ reveal, durationMs }: { reveal: boolean; durationMs: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let keys = new Float32Array(0);
    let image: ImageData | null = null;
    let pixels = new Uint32Array(0);

    const paint = () => {
      if (!image) return;
      const p = progressRef.current;
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        pixels[i] = k < p - BAND ? 0 : k < p ? ACCENT : BG;
      }
      ctx.putImageData(image, 0, 0);
    };

    const resize = () => {
      const w = Math.ceil(window.innerWidth / CELL);
      const h = Math.ceil(window.innerHeight / CELL);
      canvas.width = w;
      canvas.height = h;
      image = ctx.createImageData(w, h);
      pixels = new Uint32Array(image.data.buffer);
      keys = new Float32Array(w * h);
      const cx = (w - 1) / 2;
      const cy = (h - 1) / 2;
      const reach = Math.hypot(cx, cy);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const d = Math.hypot(x - cx, y - cy) / reach;
          keys[y * w + x] = RADIAL * d + (1 - RADIAL) * bayer(x, y);
        }
      }
      paint();
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    if (reveal) {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, ((now - start) / durationMs - DELAY) / (1 - DELAY)));
        progressRef.current = t * t * (3 - 2 * t) * (1 + BAND);
        paint();
        if (now - start < durationMs) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reveal, durationMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
