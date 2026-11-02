"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { HALFTONE_CELL, bayer } from "@/app/lib/halftone";

const CELL = HALFTONE_CELL;
const MAX_DPR = 1.5;
const LEVELS = 6;
const IDLE_S = 2.4;
const BUILD_S = 1.3;
const HOLD_S = 1.7;
const DISSOLVE_S = 1.3;
const CYCLE_S = IDLE_S + BUILD_S + HOLD_S + DISSOLVE_S;
const INTRO_S = 2.2;
const NEUTRAL = "200, 205, 220";
const ACCENT = "68, 120, 238";

type IconDraw = (g: CanvasRenderingContext2D, s: number, lw: number) => void;

const ICONS: IconDraw[] = [
  (g, s, lw) => {
    g.beginPath();
    g.moveTo(-0.34 * s, -0.2 * s);
    g.lineTo(-0.06 * s, 0.04 * s);
    g.lineTo(-0.34 * s, 0.28 * s);
    g.moveTo(0.04 * s, 0.28 * s);
    g.lineTo(0.36 * s, 0.28 * s);
    g.lineWidth = lw;
    g.stroke();
  },
  (g, s, lw) => {
    g.lineWidth = lw;
    [
      [-0.28, -0.1],
      [0, 0.16],
      [0.28, -0.22],
    ].forEach(([x, knob]) => {
      g.beginPath();
      g.moveTo(x * s, -0.4 * s);
      g.lineTo(x * s, 0.4 * s);
      g.stroke();
      g.beginPath();
      g.moveTo((x - 0.08) * s, knob * s);
      g.lineTo((x + 0.08) * s, knob * s);
      g.lineWidth = lw * 1.5;
      g.stroke();
      g.lineWidth = lw;
    });
  },
  (g, s, lw) => {
    g.lineWidth = lw * 0.9;
    const zero = (cx: number, cy: number) => {
      g.beginPath();
      g.ellipse(cx * s, cy * s, 0.075 * s, 0.13 * s, 0, 0, Math.PI * 2);
      g.stroke();
    };
    const one = (cx: number, cy: number) => {
      g.beginPath();
      g.moveTo((cx - 0.05) * s, (cy - 0.07) * s);
      g.lineTo(cx * s, (cy - 0.13) * s);
      g.lineTo(cx * s, (cy + 0.13) * s);
      g.stroke();
    };
    zero(-0.14, -0.2);
    one(0.14, -0.2);
    one(-0.14, 0.2);
    zero(0.14, 0.2);
  },
  (g, s, lw) => {
    g.lineWidth = lw;
    const r = 0.42 * s;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      const b = a + (Math.PI * 2) / 3;
      g.beginPath();
      g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      g.lineTo(Math.cos(b) * r * 0.5, Math.sin(b) * r * 0.5);
      g.stroke();
    }
  },
];

function ease(p: number): number {
  const c = Math.min(1, Math.max(0, p));
  return c * c * (3 - 2 * c);
}

function phase(t: number): { icon: number; m: number; rumble: number } {
  const cycle = Math.floor(t / CYCLE_S);
  const c = t - cycle * CYCLE_S;
  const icon = cycle % ICONS.length;
  if (c < IDLE_S) return { icon, m: 0, rumble: 0 };
  if (c < IDLE_S + BUILD_S) {
    const p = (c - IDLE_S) / BUILD_S;
    return { icon, m: ease(p), rumble: Math.sin(p * Math.PI) };
  }
  if (c < IDLE_S + BUILD_S + HOLD_S) return { icon, m: 1, rumble: 0 };
  const p = (c - IDLE_S - BUILD_S - HOLD_S) / DISSOLVE_S;
  return { icon, m: 1 - ease(p), rumble: 0.6 * Math.sin(p * Math.PI) };
}

export default function TerrainField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let masks: Float32Array[] = [];
    let rafId: number | null = null;

    const build = () => {
      const mask = document.createElement("canvas");
      mask.width = cols;
      mask.height = rows;
      const g = mask.getContext("2d", { willReadFrequently: true });
      if (!g) return;
      const s = Math.min(cols, rows) * 0.5;
      masks = ICONS.map((draw) => {
        g.clearRect(0, 0, cols, rows);
        g.save();
        g.translate(cols / 2, rows / 2);
        g.strokeStyle = "#fff";
        g.lineCap = "round";
        g.lineJoin = "round";
        draw(g, s, Math.max(2, s * 0.085));
        g.restore();
        const data = g.getImageData(0, 0, cols, rows).data;
        const out = new Float32Array(cols * rows);
        for (let n = 0; n < out.length; n++) out[n] = data[n * 4 + 3] / 255;
        return out;
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      build();
    };

    const draw = (seconds: number) => {
      ctx.clearRect(0, 0, width, height);
      if (masks.length === 0) return;
      const { icon, m, rumble } = phase(seconds);
      const mask = masks[icon];
      const intro = ease(seconds / INTRO_S);
      const reach = Math.hypot(cols, rows) * 0.6 * intro;
      const cx = cols / 2;
      const cy = rows / 2;
      const shakeX = Math.sin(seconds * 53) * rumble * 1.6;
      const shakeY = Math.cos(seconds * 47) * rumble * 1.6;
      ctx.save();
      ctx.translate(shakeX, shakeY);

      const paths = [0, 1].map(() =>
        Array.from({ length: LEVELS }, () => new Path2D()),
      );

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const n = gy * cols + gx;
          const dist = Math.hypot(gx - cx, (gy - cy) * 1.1);
          const fade = Math.min(1, Math.max(0, (reach - dist) / 12));
          if (fade <= 0) continue;

          const a = Math.sin(
            gx * 0.045 +
              seconds * 0.35 +
              Math.sin(gy * 0.03 - seconds * 0.2) * 2,
          );
          const b = Math.sin(
            gy * 0.06 -
              seconds * 0.28 +
              Math.sin(gx * 0.05 + seconds * 0.17) * 1.6,
          );
          const c = Math.sin((gx + gy) * 0.025 + seconds * 0.15);
          let h = 1 - Math.abs(a * 0.5 + b * 0.35 + c * 0.25);
          h *= h;

          const icon01 = mask[n];
          h *= 1 - 0.65 * m * (1 - icon01);
          h = h * (1 - m * icon01) + m * icon01;
          h +=
            Math.sin(dist * 0.4 - seconds * 9) *
            Math.exp(-dist * 0.035) *
            rumble *
            0.35;
          h *= fade;

          if (h <= bayer(gx, gy) * 0.4) continue;
          const level = Math.min(
            LEVELS - 1,
            Math.floor(Math.min(1, Math.max(0, h)) * LEVELS),
          );
          const radius = CELL * (0.1 + (level / (LEVELS - 1)) * 0.34);
          const px =
            (gx + 0.5) * CELL +
            Math.sin(gy * 1.7 + seconds * 40) * rumble * 1.2;
          const py = (gy + 0.5) * CELL - h * CELL * 1.1;
          const path = paths[m * icon01 > 0.35 ? 1 : 0][level];
          path.moveTo(px + radius, py);
          path.arc(px, py, radius, 0, Math.PI * 2);
        }
      }

      for (let kind = 0; kind < 2; kind++) {
        for (let level = 0; level < LEVELS; level++) {
          const alpha =
            0.06 + (level / (LEVELS - 1)) * (kind === 1 ? 0.75 : 0.4);
          ctx.fillStyle = `rgba(${kind === 1 ? ACCENT : NEUTRAL}, ${alpha})`;
          ctx.fill(paths[kind][level]);
        }
      }
      ctx.restore();
    };

    resize();
    const onResize = () => {
      resize();
      if (reduceMotion) draw(IDLE_S + BUILD_S + 0.1 + INTRO_S);
    };
    window.addEventListener("resize", onResize);

    if (reduceMotion) {
      draw(IDLE_S + BUILD_S + 0.1 + INTRO_S);
    } else {
      const start = performance.now();
      const tick = (now: number) => {
        rafId = requestAnimationFrame(tick);
        draw((now - start) / 1000);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
