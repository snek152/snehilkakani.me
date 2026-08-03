"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./MotionPreference";

/**
 * WaveField
 * ---------
 * Site-wide, ultra-subtle animated background: a bundle of thin drifting
 * curves crossing at a few nodes, reading as something cosmic/interstellar
 * rather than a voice-meter. Single `<canvas>` driven by rAF, fixed behind
 * all page content.
 *
 * Tuning knobs — all intentionally exported as consts so this can be
 * adjusted or ripped out without hunting through the draw loop.
 */

/** Number of filaments in the bundle. */
const CURVE_COUNT = 7;

/** Peak amplitude of a curve, as a fraction of viewport height. */
const AMPLITUDE_RATIO = 0.09;

/** Drift speed — radians of phase advanced per millisecond. Slow enough
 * that nothing ever appears to scroll past, fast enough that the figure
 * is visibly alive if you rest your eyes on it: the strands should read
 * as drifting, not as a still image. */
const DRIFT_SPEED = 0.00005;
/** Base stroke alpha for the (mostly white) filaments. */
const BASE_ALPHA_MIN = 0.04;
const BASE_ALPHA_MAX = 0.1;

/** Stroke width in device-independent px. */
const LINE_WIDTH = 1;

/** Cap on devicePixelRatio to bound canvas backing-store cost. */
const MAX_DPR = 2;

/** Accent-blue tint applied to a couple of strands, at very low alpha. */
const ACCENT_COLOR = "37, 99, 235"; // #2563eb as an rgb triple
const ACCENT_ALPHA_MIN = 0.03;
const ACCENT_ALPHA_MAX = 0.06;

/** Non-integer frequency ratios per curve — irrational-ish spread so the
 * bundle never settles into a mirrored or periodic-looking shape. Index
 * `i` picks `FREQ_RATIOS[i % FREQ_RATIOS.length]`. */
const FREQ_RATIOS = [1, 1.37, 1.71, 2.13, 0.79, 1.53, 2.31, 0.61];

/** Secondary, slower modulation ratios layered on top of the primary wave
 * to break up any residual symmetry / periodicity. */
const SECOND_FREQ_RATIOS = [0.31, 0.47, 0.19, 0.53, 0.37, 0.29, 0.43, 0.23];

interface CurveConfig {
  freq: number;
  freq2: number;
  phase: number;
  phase2: number;
  ampScale: number;
  yOffsetRatio: number;
  isAccent: boolean;
  alpha: number;
}

function buildCurves(): CurveConfig[] {
  const curves: CurveConfig[] = [];
  for (let i = 0; i < CURVE_COUNT; i++) {
    // Deterministic but non-uniform per-curve pseudo-randomness derived
    // from the index, so the layout is stable across renders/reloads
    // without needing a seeded RNG dependency.
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);

    curves.push({
      freq: FREQ_RATIOS[i % FREQ_RATIOS.length],
      freq2: SECOND_FREQ_RATIOS[i % SECOND_FREQ_RATIOS.length],
      phase: frac * Math.PI * 2,
      phase2: (1 - frac) * Math.PI * 2,
      ampScale: 0.55 + frac * 0.9,
      // Spread the bundle's resting lines across the middle band of the
      // viewport, not perfectly evenly — nudged off-grid per curve.
      yOffsetRatio: 0.5 + (i - (CURVE_COUNT - 1) / 2) * 0.045 + (frac - 0.5) * 0.02,
      isAccent: i === 1 || i === CURVE_COUNT - 2,
      alpha: BASE_ALPHA_MIN + frac * (BASE_ALPHA_MAX - BASE_ALPHA_MIN),
    });
  }
  return curves;
}

export default function WaveField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const curves = buildCurves();
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      // A bare `<canvas>` with no explicit size is a replaced element
      // with an intrinsic 300x150 box — setting `fixed inset-0` alone
      // doesn't stretch it. Force it to fill its fixed box via CSS
      // percentages first, then measure that box (never
      // `window.innerWidth`, which includes the scrollbar gutter and
      // would make the canvas wider than the page on any machine
      // showing a scrollbar).
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const rect = canvas.getBoundingClientRect();
      width = rect.width || document.documentElement.clientWidth;
      height = rect.height || document.documentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const draw = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);

      const samples = Math.max(2, Math.round(width / 4));

      for (const curve of curves) {
        ctx.beginPath();
        const baseY = height * curve.yOffsetRatio;
        const amp = height * AMPLITUDE_RATIO * curve.ampScale;
        const t = timeMs * DRIFT_SPEED;

        for (let s = 0; s <= samples; s++) {
          const xRatio = s / samples;
          const x = xRatio * width;
          // Two overlaid sinusoids at incommensurate frequency ratios,
          // each with its own slow phase drift, produce a shape that
          // never repeats and never mirrors left-to-right.
          const primary = Math.sin(xRatio * Math.PI * 2 * curve.freq + t + curve.phase);
          const secondary =
            0.4 * Math.sin(xRatio * Math.PI * 2 * curve.freq2 + t * 1.31 + curve.phase2);
          const y = baseY + amp * (primary + secondary);

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineWidth = LINE_WIDTH;
        if (curve.isAccent) {
          const accentAlpha =
            ACCENT_ALPHA_MIN + (curve.alpha - BASE_ALPHA_MIN) * (ACCENT_ALPHA_MAX - ACCENT_ALPHA_MIN);
          ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${accentAlpha})`;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${curve.alpha})`;
        }
        ctx.stroke();
      }
    };

    let rafId: number | null = null;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      draw(now - startTime);
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const start = () => {
      if (rafId === null && !document.hidden) {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (reduceMotion) {
      // Single static frame, no loop.
      draw(0);
    } else {
      start();
    }

    const handleVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleResize = () => {
      resize();
      draw(startTime === null ? 0 : performance.now() - startTime);
    };
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(document.documentElement);
    }

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
