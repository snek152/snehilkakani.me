"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { HALFTONE_CELL, bayer } from "@/app/lib/halftone";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

const CELL = HALFTONE_CELL / 2;
const MAX_DPR = 2;
const LAYERS = 12;
const THICKNESS_PX = 14;
const SPIN_RAD_PER_MS = 0.00042;
const REST_ANGLE = 0.62;
const LEVELS = 4;
const MASK_RES = 160;
const FACE_RGB = "239, 239, 239";
const SIDE_RGB = "68, 120, 238";

export default function LogoSpin({
  src,
  aspect,
  label,
  luma = false,
}: {
  src: string;
  aspect: number;
  label: string;
  luma?: boolean;
}) {
  const reduceMotion = useMotionPreference();
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(boxRef, { margin: "120px 0px" });

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box || (!inView && !reduceMotion)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cover: Float32Array | null = null;
    const mw = Math.round(MASK_RES * Math.max(1, aspect));
    const mh = Math.round(MASK_RES * Math.max(1, 1 / aspect));
    let width = 0;
    let height = 0;
    let angle = REST_ANGLE;
    let last: number | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const img = new Image();
    img.src = src;

    const sample = (u: number, v: number) => {
      if (!cover || u < 0 || u >= 1 || v < 0 || v >= 1) return 0;
      return cover[((v * mh) | 0) * mw + ((u * mw) | 0)];
    };

    const size = () => {
      const r = box.getBoundingClientRect();
      width = r.width;
      height = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (!cover) return;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const safeCos = Math.max(Math.abs(cos), 0.04);
      const backFacing = cos < 0;
      const turn = 0.55 + 0.45 * Math.abs(cos);
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      const buckets: Path2D[] = Array.from(
        { length: LEVELS * 2 },
        () => new Path2D(),
      );

      for (let gy = 0; gy < rows; gy++) {
        const py = (gy + 0.5) * CELL;
        const v = py / height;
        for (let gx = 0; gx < cols; gx++) {
          const px = (gx + 0.5) * CELL;
          const dx = px - width / 2;
          for (let n = 0; n < LAYERS; n++) {
            const k = backFacing ? LAYERS - 1 - n : n;
            const z = -(k / (LAYERS - 1)) * THICKNESS_PX;
            const u = (dx - z * sin) / safeCos / width + 0.5;
            const c = sample(u, v);
            if (c < 0.05) continue;
            const isFace = n === 0;
            const light = Math.max(
              0.12,
              Math.min(1, 0.7 - 0.55 * (u * 0.5 + v * 0.9 - 0.7)),
            );
            const value = isFace ? c * light * turn : c * 0.7 * light;
            if (value < bayer(gx, gy) * 0.3) break;
            const radius = CELL * 0.52 * Math.min(1, value * 1.15);
            if (radius < 0.4) break;
            const level = Math.min(LEVELS - 1, (value * LEVELS) | 0);
            const path = buckets[(isFace ? 0 : LEVELS) + level];
            path.moveTo(px + radius, py);
            path.arc(px, py, radius, 0, Math.PI * 2);
            break;
          }
        }
      }

      for (let b = 0; b < buckets.length; b++) {
        const level = b % LEVELS;
        ctx.fillStyle = `rgba(${b < LEVELS ? FACE_RGB : SIDE_RGB}, ${
          0.3 + (0.7 * level) / (LEVELS - 1)
        })`;
        ctx.fill(buckets[b]);
      }
    };

    const tick = (now: number) => {
      angle += last === null ? 0 : (now - last) * SPIN_RAD_PER_MS;
      last = now;
      draw();
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      size();
      if (reduceMotion) draw();
      else rafId = requestAnimationFrame(tick);
    };

    img.onload = () => {
      if (cancelled) return;
      const off = document.createElement("canvas");
      off.width = mw;
      off.height = mh;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, mw, mh);
      const px = octx.getImageData(0, 0, mw, mh).data;
      cover = new Float32Array(mw * mh);
      for (let i = 0; i < cover.length; i++) {
        const a = px[i * 4 + 3] / 255;
        const l = (px[i * 4] + px[i * 4 + 1] + px[i * 4 + 2]) / 765;
        cover[i] = luma ? a * l : a;
      }
      start();
    };

    const onResize = () => {
      size();
      if (reduceMotion || rafId === null) draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [src, aspect, luma, inView, reduceMotion]);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={`${label} logo`}
      className="mt-10 hidden lg:block"
      style={{
        width: `min(100%, 14rem, ${aspect * 7}rem)`,
        aspectRatio: aspect,
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </div>
  );
}
