"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./MotionPreference";

/**
 * WaveField
 * ---------
 * Site-wide, ultra-subtle animated background: a bundle of thin drifting
 * filaments crossing at a few nodes, reading as something cosmic/interstellar
 * rather than a voice-meter. Single `<canvas>` driven by rAF, fixed behind
 * all page content.
 *
 * Contrast hierarchy — the point of the whole tuning. The structural
 * hairline (`--color-border`, white at 0.07) composites to 25/255 over the
 * #080808 page. The rule is per-percentile, not per-pixel: the BODY of the
 * field must stay clearly under that, while isolated "lighter"-blended
 * crossings are allowed to reach and pass it, because a small soft node is
 * read as light, whereas a continuous strand at rule brightness is read as
 * another edge in the layout. That distinction is what fixed the wave
 * colliding with the text.
 *
 * Measured at 1440x900 (composited, over the page background): p50 11,
 * p75 15, p90 18, p99 24, p99.9 29, max ~39-53 at the brightest crossing.
 * So ~99% of the field sits at or below the hairline and only the nodes
 * exceed it. Constraining the PEAK below 25 instead is what the first
 * attempt did, and it drove the typical strand to alpha 2/255 — the whole
 * field became invisible. Tune against the percentiles, not the maximum.
 *
 * Softening: strokes are rendered to a half-resolution offscreen canvas
 * (1/4 the pixels of the visible backing store) and upscaled with bilinear
 * smoothing onto the visible canvas. That upscale is what turns 1px lines
 * into soft ~2px filaments — cheaper per frame than an animated CSS
 * `filter: blur()` on a full-viewport canvas, and it composites the
 * "lighter" crossings at the same reduced resolution, which is exactly
 * where that blend is most expensive.
 *
 * Tuning knobs — all intentionally exported as consts so this can be
 * adjusted or ripped out without hunting through the draw loop.
 */

/** Number of filaments in the bundle. */
const CURVE_COUNT = 8;

/** Peak amplitude of a curve, as a fraction of viewport height. */
const AMPLITUDE_RATIO = 0.09;

/** Drift speed — radians of phase advanced per millisecond. Slow enough
 * that nothing ever appears to scroll past, fast enough that the figure
 * is visibly alive if you rest your eyes on it: the strands should read
 * as drifting, not as a still image. This remains the ceiling for
 * apparent speed — breathing and wander below are slower still. */
const DRIFT_SPEED = 0.00005;

/** Amplitude "breathing" — each filament's amplitude slowly swells and
 * recedes at an incommensurate rate relative to phase drift, so the
 * figure's shape (not just its position) changes over time. */
const BREATHE_SPEED = DRIFT_SPEED * 0.211;
const BREATHE_DEPTH = 0.35;

/** Baseline "wander" — each filament's resting height drifts slowly up
 * and down, independent of the others, at yet another incommensurate
 * rate. Combined with breathing and phase drift, no two filaments are
 * ever in the same relative configuration twice. */
const WANDER_SPEED = DRIFT_SPEED * 0.347;
const WANDER_RATIO = 0.025;

/** Base stroke alpha for the far (background) layer of filaments, and
 * the multiplier applied to promote a filament into the near layer.
 *
 * These are tuned against the composited result, not the raw value. The
 * structural hairline (`--color-border`, white at 0.07) composites to 25
 * over the #080808 page, and a decorative curve must stay under that or
 * it competes with real rules — that is what made the earlier, brighter
 * field collide with the text. But the ceiling has to be hit by the
 * TYPICAL strand, not only by a rare "lighter" crossing: tuned purely to
 * the peak, the mean strand fell to alpha 2/255 and the whole field
 * disappeared. Aim: an ordinary filament reads clearly, the brightest
 * crossing still sits below the hairline. */
const BASE_ALPHA_MIN = 0.05;
const BASE_ALPHA_MAX = 0.085;
const NEAR_ALPHA_SCALE = 1.35;

/** Stroke widths in device-independent px, pre-blur. Near filaments read
 * as closer: thicker and a touch brighter. Far filaments are thin
 * background texture. */
const LINE_WIDTH_FAR = 0.9;
const LINE_WIDTH_NEAR = 1.5;

/** Fraction of the canvas width, at each edge, over which a filament's
 * alpha eases to zero — this is what keeps lines from running hard into
 * the surrounding text and borders. */
const EDGE_FALLOFF = 0.16;

/** Backing-store resolution divisor for the offscreen render target.
 * 2 == quarter the pixel count of the visible canvas. */
const RENDER_SCALE = 2;

/** Cap on devicePixelRatio to bound canvas backing-store cost. */
const MAX_DPR = 2;

/** Accent-blue tint applied to a couple of strands, at very low alpha. */
const ACCENT_COLOR = "37, 99, 235"; // #2563eb as an rgb triple
const ACCENT_ALPHA_MIN = 0.01;
const ACCENT_ALPHA_MAX = 0.02;

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
  breathePhase: number;
  wanderPhase: number;
  ampScale: number;
  yOffsetRatio: number;
  isAccent: boolean;
  isNear: boolean;
  alpha: number;
  lineWidth: number;
}

function buildCurves(): CurveConfig[] {
  const curves: CurveConfig[] = [];
  for (let i = 0; i < CURVE_COUNT; i++) {
    // Deterministic but non-uniform per-curve pseudo-randomness derived
    // from the index, so the layout is stable across renders/reloads
    // without needing a seeded RNG dependency.
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    const isNear = i % 2 === 0;

    curves.push({
      freq: FREQ_RATIOS[i % FREQ_RATIOS.length],
      freq2: SECOND_FREQ_RATIOS[i % SECOND_FREQ_RATIOS.length],
      phase: frac * Math.PI * 2,
      phase2: (1 - frac) * Math.PI * 2,
      breathePhase: ((frac * 7) % 1) * Math.PI * 2,
      wanderPhase: ((frac * 5) % 1) * Math.PI * 2,
      ampScale: 0.55 + frac * 0.9,
      // Spread the bundle's resting lines across the middle band of the
      // viewport, not perfectly evenly — nudged off-grid per curve.
      yOffsetRatio: 0.5 + (i - (CURVE_COUNT - 1) / 2) * 0.045 + (frac - 0.5) * 0.02,
      isAccent: i === 1 || i === CURVE_COUNT - 2,
      isNear,
      alpha:
        (BASE_ALPHA_MIN + frac * (BASE_ALPHA_MAX - BASE_ALPHA_MIN)) *
        (isNear ? NEAR_ALPHA_SCALE : 1),
      lineWidth: isNear ? LINE_WIDTH_NEAR : LINE_WIDTH_FAR,
    });
  }
  return curves;
}

/** A horizontal alpha-falloff gradient: transparent at both edges, full
 * strength across the middle. Stroking a curve with this as its style
 * instead of a flat rgba lets filaments emerge and dissolve at the
 * viewport edges instead of running hard into the surrounding layout. */
function falloffGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  colorRgb: string,
  alpha: number,
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, `rgba(${colorRgb}, 0)`);
  gradient.addColorStop(EDGE_FALLOFF, `rgba(${colorRgb}, ${alpha})`);
  gradient.addColorStop(1 - EDGE_FALLOFF, `rgba(${colorRgb}, ${alpha})`);
  gradient.addColorStop(1, `rgba(${colorRgb}, 0)`);
  return gradient;
}

export default function WaveField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreen render target at reduced resolution: strokes are drawn
    // here (including the additive "lighter" crossings), then the whole
    // thing is upscaled with smoothing onto the visible canvas. That
    // upscale is the "blur".
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    const curves = buildCurves();
    let width = 0;
    let height = 0;
    let offWidth = 0;
    let offHeight = 0;
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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";

      offWidth = Math.max(1, Math.round(canvas.width / RENDER_SCALE));
      offHeight = Math.max(1, Math.round(canvas.height / RENDER_SCALE));
      offscreen.width = offWidth;
      offscreen.height = offHeight;
      // The offscreen target draws in the same logical (CSS px) space as
      // the visible canvas, just at 1/RENDER_SCALE device pixels, so all
      // the curve math below is resolution-independent.
      offCtx.setTransform(dpr / RENDER_SCALE, 0, 0, dpr / RENDER_SCALE, 0, 0);
    };

    resize();

    const draw = (timeMs: number) => {
      offCtx.clearRect(0, 0, width, height);
      offCtx.globalCompositeOperation = "lighter";

      const samples = Math.max(2, Math.round(width / 4));
      const t = timeMs * DRIFT_SPEED;
      const tBreathe = timeMs * BREATHE_SPEED;
      const tWander = timeMs * WANDER_SPEED;

      for (const curve of curves) {
        const breathe = 1 + BREATHE_DEPTH * Math.sin(tBreathe + curve.breathePhase);
        const wander = WANDER_RATIO * Math.sin(tWander + curve.wanderPhase);
        const baseY = height * (curve.yOffsetRatio + wander);
        const amp = height * AMPLITUDE_RATIO * curve.ampScale * breathe;

        offCtx.beginPath();
        for (let s = 0; s <= samples; s++) {
          const xRatio = s / samples;
          const x = xRatio * width;
          // Two overlaid sinusoids at incommensurate frequency ratios,
          // each with its own slow phase drift, produce a shape that
          // never repeats and never mirrors left-to-right. Amplitude
          // breathing and baseline wander (above) further ensure the
          // figure's form, not just its position, keeps changing.
          const primary = Math.sin(xRatio * Math.PI * 2 * curve.freq + t + curve.phase);
          const secondary =
            0.4 * Math.sin(xRatio * Math.PI * 2 * curve.freq2 + t * 1.31 + curve.phase2);
          const y = baseY + amp * (primary + secondary);

          if (s === 0) offCtx.moveTo(x, y);
          else offCtx.lineTo(x, y);
        }

        offCtx.lineWidth = curve.lineWidth;
        if (curve.isAccent) {
          const accentAlpha =
            ACCENT_ALPHA_MIN +
            (curve.alpha - BASE_ALPHA_MIN) * (ACCENT_ALPHA_MAX - ACCENT_ALPHA_MIN);
          offCtx.strokeStyle = falloffGradient(offCtx, width, ACCENT_COLOR, accentAlpha);
        } else {
          offCtx.strokeStyle = falloffGradient(offCtx, width, "255, 255, 255", curve.alpha);
        }
        offCtx.stroke();
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreen, 0, 0, width, height);
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
