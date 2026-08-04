"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./MotionPreference";

/**
 * WaveField
 * ---------
 * Site-wide ambient background: a bundle of filaments defined in 3D and
 * tumbling slowly behind all page content. Single `<canvas>` driven by rAF,
 * fixed at `z-0`.
 *
 * The geometry is genuinely three-dimensional, not a stack of 2D sines. Each
 * filament is a curve in (x, y, z); the whole bundle is rotated about Y and X
 * by two slowly beating angles and then perspective-projected. Depth is what
 * drives stroke width, brightness and how quickly a strand dissolves, so
 * strands visibly sweep toward and away from the viewer and pass through one
 * another instead of sliding across a flat band.
 *
 * Two earlier problems this shape fixes:
 *
 * - The old field was a flat horizontal band across the middle of the frame,
 *   which read as a sound-wave graphic — the one thing an ambient background
 *   on a music-adjacent site must not look like.
 * - Its fade was a screen-space linear gradient masking a fixed fraction of
 *   each edge. Because the mask was rectangular and axis-aligned while the
 *   content was not, it read as a vertical band of "weird transparency"
 *   rather than as lines ending. Fading is now purely a function of DEPTH:
 *   far parts of a strand dissolve the way distant things do. Filaments also
 *   extend well past the frame (`SPAN` > 1), so their ends are off-screen and
 *   nothing needs masking at the edges at all.
 *
 * Contrast hierarchy — the constraint the whole tuning serves. The structural
 * hairline (`--color-border`, white at 0.07) composites to 25/255 over the
 * #080808 page. The rule is per-percentile, not per-pixel: the BODY of the
 * field stays clearly under that, while isolated additive crossings may reach
 * or pass it. A small soft node reads as light; a continuous strand at rule
 * brightness reads as another edge in the layout, which is what made an
 * earlier version collide with the text. Constraining the PEAK instead drove
 * the typical strand to alpha 2/255 and the field vanished entirely — so tune
 * against percentiles, never the maximum.
 *
 * Softness comes from stroking each strand twice (a wide dim halo under a
 * narrow core) rather than from blurring. An earlier version rendered to a
 * half-resolution offscreen canvas and upscaled; that is cheap, but bilinear
 * upscaling of hairlines is exactly what made the transparency look uneven.
 * Two passes at full resolution are clean at every DPR.
 */

/** Number of filaments in the bundle. Dense on purpose: the interference
 * between many faint strands is what makes the field read as a woven,
 * shifting volume rather than a few swooshes. Per-strand alpha is scaled
 * down to compensate, so density buys structure, not brightness. */
const CURVE_COUNT = 16;

/** Samples along each filament, and the number of contiguous alpha bands
 * those samples are grouped into.
 *
 * `SAMPLES` has to clear the fastest strand comfortably: the busiest curve
 * carries `max(FREQ_RATIOS) * FREQ_SCALE` ≈ 6.7 cycles, and at only ~9
 * samples per cycle the polyline is visibly faceted — the peaks come out as
 * hard corners rather than curves. This gives ~19 samples per cycle at the
 * top frequency, which is smooth, and the draw cost is measured rather than
 * assumed: see the note on MAX_DPR.
 *
 * Depth alpha varies continuously along a strand, but stroking every segment
 * separately would double-blend at every antialiased seam and bead the line
 * under additive compositing. Banding strokes one path per group, so only the
 * band boundaries touch — and they share a single vertex, so the overlap is
 * zero-width. */
const SAMPLES = 130;
const BANDS = 12;

/** Half-extent of a filament along its own axis, in units of half the
 * viewport. Greater than 1 so both ends sit outside the frame: strands enter
 * and leave like light trails instead of needing an edge mask. */
const SPAN = 1.6;

/** Peak lateral excursion of a filament, as a fraction of viewport height. */
const AMPLITUDE_RATIO = 0.15;

/** Depth excursion, in projection units. This is what gives the bundle its
 * volume — without it the rotation below would just shear a flat sheet. */
const DEPTH_RATIO = 1.05;

/** Hard bound on rotated depth, and the camera distance for the perspective
 * divide.
 *
 * `FOCAL` MUST exceed `Z_LIMIT`, with margin. Rotated depth is not bounded by
 * `DEPTH_RATIO`: rotating about Y folds the filament's own axis into z, so
 * `rz2` picks up `SPAN * sin(rotY)` plus `ly * sin(rotX)` on top of `lz`, and
 * reaches about ±3 at these amplitudes. With a focal length shorter than
 * that, `FOCAL + rz2` crosses zero, the divide flips sign, and single
 * segments fire across the whole frame. z is clamped to the limit as well, so
 * the guarantee does not depend on re-deriving that bound every time an
 * amplitude is tuned. */
const Z_LIMIT = 3.1;
const FOCAL = 5.2;

/** Master clock — radians of phase per millisecond. Everything else is
 * expressed as a ratio of this, so the whole field speeds up or slows down
 * from one number. */
const TIME_SCALE = 0.00016;

/** Bundle tumble. Two incommensurate rates on two axes, so the figure never
 * returns to the same orientation. Amplitudes are small: this is a bundle
 * breathing in depth, not an object spinning. */
const ROT_Y_SPEED = 0.42;
const ROT_Y_AMP = 0.55;
const ROT_X_SPEED = 0.27;
const ROT_X_AMP = 0.22;

/** Helical twist: phase advances along a strand's own length, so it winds
 * around its axis instead of undulating in a plane. With the tumble above,
 * this is most of what makes the crossings read as three-dimensional. */
const TWIST_SPEED = 0.31;
const TWIST_AMP = 1.35;

/** Amplitude breathing and baseline wander, each at its own incommensurate
 * rate, so a strand's form keeps changing rather than only its position. */
const BREATHE_SPEED = 0.23;
const BREATHE_DEPTH = 0.4;
const WANDER_SPEED = 0.17;
const WANDER_RATIO = 0.07;

/** Stroke alpha range for filaments at mid-depth, before the depth term.
 * Low because there are many strands: density is meant to buy structure and
 * interference, not brightness. Tuned against the composited percentiles in
 * the header note. */
const BASE_ALPHA_MIN = 0.066;
const BASE_ALPHA_MAX = 0.118;

/** How much depth darkens a strand: the far extreme keeps this fraction of
 * its brightness, the near extreme keeps all of it. This replaces the old
 * screen-space edge mask entirely. */
const DEPTH_ALPHA_FLOOR = 0.1;

/** Core stroke width in CSS px at unit depth, and the halo multiplier /
 * alpha share that sits under it to soften the edge. */
const CORE_WIDTH = 1.05;
const HALO_WIDTH_SCALE = 3.6;
const HALO_ALPHA_SHARE = 0.26;

/** Cap on devicePixelRatio.
 *
 * Deliberately below 2. This is a soft, low-contrast, out-of-focus layer with
 * no hard edges to alias, so the extra backing store a retina display would
 * ask for buys nothing visible while costing fill on every one of the ~380
 * strokes per frame. Measured at 1440x900: the draw body runs ~1.6ms median
 * at the previous settings, and this is the single biggest lever on that
 * number for high-DPR screens. */
const MAX_DPR = 1.5;

/** Accent tint carried by a couple of strands, at very low alpha.
 *
 * This is `--accent` from `globals.css` as an rgb triple, since canvas needs
 * the components rather than a hex. Note that this design renamed the brand
 * blue: `--color-primary` is an alias of `--accent`, not a second colour, so
 * there is exactly one blue on the site and this is it. (`AGENTS.md` still
 * documents the previous site's `#0d6efd`.) Keep in step with the token. */
const ACCENT_COLOR = "37, 99, 235"; // #2563eb
const ACCENT_ALPHA_SCALE = 0.45;

/** Non-integer frequency ratios — an irrational-ish spread so the bundle
 * never settles into a mirrored or periodic-looking shape.
 *
 * `FREQ_SCALE` sets how many times a strand crosses its own axis across the
 * frame. Low values give a handful of lazy swooshes; this many strands only
 * start to weave — to cross each other often enough that the crossings form
 * a moving interference pattern — once each one carries a few cycles. That
 * interference is the whole effect. */
const FREQ_SCALE = 2.7;
const FREQ_RATIOS = [1, 1.37, 1.71, 2.13, 0.79, 1.53, 2.31, 0.61, 1.19, 1.83, 0.93, 2.47, 1.11, 0.67, 1.97, 1.29];
const SECOND_FREQ_RATIOS = [0.31, 0.47, 0.19, 0.53, 0.37, 0.29, 0.43, 0.23, 0.41, 0.59, 0.17, 0.51, 0.33, 0.27, 0.61, 0.21];
const DEPTH_FREQ_RATIOS = [0.63, 0.91, 1.24, 0.48, 1.07, 0.72, 1.41, 0.86, 0.57, 1.13, 0.79, 1.32, 0.69, 0.97, 1.19, 0.83];

interface CurveConfig {
  freq: number;
  freq2: number;
  depthFreq: number;
  phase: number;
  phase2: number;
  depthPhase: number;
  breathePhase: number;
  wanderPhase: number;
  twistPhase: number;
  ampScale: number;
  depthScale: number;
  yOffset: number;
  alpha: number;
  isAccent: boolean;
}

function buildCurves(): CurveConfig[] {
  const curves: CurveConfig[] = [];
  for (let i = 0; i < CURVE_COUNT; i++) {
    // Deterministic per-curve pseudo-randomness derived from the index, so
    // the bundle is stable across reloads without a seeded RNG dependency.
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    const seed2 = Math.sin(i * 78.233) * 24634.6345;
    const frac2 = seed2 - Math.floor(seed2);

    curves.push({
      freq: FREQ_RATIOS[i % FREQ_RATIOS.length] * FREQ_SCALE,
      freq2: SECOND_FREQ_RATIOS[i % SECOND_FREQ_RATIOS.length] * FREQ_SCALE,
      depthFreq: DEPTH_FREQ_RATIOS[i % DEPTH_FREQ_RATIOS.length],
      phase: frac * Math.PI * 2,
      phase2: (1 - frac) * Math.PI * 2,
      depthPhase: frac2 * Math.PI * 2,
      breathePhase: ((frac * 7) % 1) * Math.PI * 2,
      wanderPhase: ((frac * 5) % 1) * Math.PI * 2,
      twistPhase: ((frac2 * 3) % 1) * Math.PI * 2,
      ampScale: 0.55 + frac * 0.9,
      depthScale: 0.45 + frac2 * 0.95,
      // Spread the resting lines across the frame, nudged off-grid per curve
      // so the bundle never looks like evenly ruled staff lines.
      yOffset: (i - (CURVE_COUNT - 1) / 2) * 0.105 + (frac - 0.5) * 0.09,
      alpha: BASE_ALPHA_MIN + frac2 * (BASE_ALPHA_MAX - BASE_ALPHA_MIN),
      isAccent: i === 2 || i === CURVE_COUNT - 3,
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

    // Projected sample buffers, reused every frame so a 60fps draw loop
    // allocates nothing.
    const px = new Float32Array(SAMPLES + 1);
    const py = new Float32Array(SAMPLES + 1);
    const pAlpha = new Float32Array(SAMPLES + 1);
    const pWidth = new Float32Array(SAMPLES + 1);

    const resize = () => {
      // A bare `<canvas>` with no explicit size is a replaced element with an
      // intrinsic 300x150 box — `fixed inset-0` alone does not stretch it.
      // Force it to fill its fixed box via CSS percentages first, then
      // measure that box. Never `window.innerWidth`: that includes the
      // scrollbar gutter, which made the canvas wider than the page and put a
      // horizontal scrollbar on every route.
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const rect = canvas.getBoundingClientRect();
      width = rect.width || document.documentElement.clientWidth;
      height = rect.height || document.documentElement.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resize();

    const draw = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      // Additive: where filaments cross they sum, so the nodes bloom on their
      // own. It is also order-independent, which is why the bundle needs no
      // depth sorting despite being genuinely 3D.
      ctx.globalCompositeOperation = "lighter";

      const t = timeMs * TIME_SCALE;
      const rotY = ROT_Y_AMP * Math.sin(t * ROT_Y_SPEED);
      const rotX = ROT_X_AMP * Math.sin(t * ROT_X_SPEED + 1.7);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width / 2;
      const cy = height / 2;
      const halfW = width / 2;
      const ampPx = height * AMPLITUDE_RATIO;

      // Perspective bounds derived from the clamped depth range, so the
      // depth term normalises into 0..1 no matter how the bundle is oriented.
      const perspNear = FOCAL / (FOCAL - Z_LIMIT);
      const perspFar = FOCAL / (FOCAL + Z_LIMIT);
      const perspSpan = perspNear - perspFar || 1;

      for (const curve of curves) {
        const breathe = 1 + BREATHE_DEPTH * Math.sin(t * BREATHE_SPEED + curve.breathePhase);
        const wander = WANDER_RATIO * Math.sin(t * WANDER_SPEED + curve.wanderPhase);
        const twist = t * TWIST_SPEED + curve.twistPhase;
        const amp = ampPx * curve.ampScale * breathe;

        for (let s = 0; s <= SAMPLES; s++) {
          // u runs -1..1 along the filament's own axis.
          const u = (s / SAMPLES) * 2 - 1;

          // Lateral displacement: two incommensurate sinusoids, plus a phase
          // that advances along the strand's own length (the twist), so the
          // curve winds rather than undulating in a single plane.
          const wave =
            Math.sin(u * Math.PI * curve.freq + curve.phase + t) +
            0.45 * Math.sin(u * Math.PI * 2 * curve.freq2 + curve.phase2 - t * 0.73);
          const twistAngle = u * TWIST_AMP + twist;

          // Local 3D point. The twist rotates the lateral displacement about
          // the strand's own axis, which is what turns a ribbon into a helix.
          const lx = u * SPAN;
          const ly = (curve.yOffset + wander) * 2 + (wave * Math.cos(twistAngle) * amp) / (height / 2);
          const lz =
            DEPTH_RATIO *
            curve.depthScale *
            (Math.sin(u * Math.PI * curve.depthFreq + curve.depthPhase + t * 0.61) * 0.65 +
              wave * Math.sin(twistAngle) * 0.35);

          // Rotate about Y, then about X.
          const rx1 = lx * cosY + lz * sinY;
          const rz1 = -lx * sinY + lz * cosY;
          const ry2 = ly * cosX - rz1 * sinX;
          // Clamped so the divide can never approach zero — see Z_LIMIT.
          const rz2 = Math.min(
            Z_LIMIT,
            Math.max(-Z_LIMIT, ly * sinX + rz1 * cosX),
          );

          // Perspective divide.
          const persp = FOCAL / (FOCAL + rz2);
          const depthT = Math.min(1, Math.max(0, (persp - perspFar) / perspSpan));

          px[s] = cx + rx1 * halfW * persp;
          py[s] = cy + ry2 * (height / 2) * persp;
          pAlpha[s] = DEPTH_ALPHA_FLOOR + (1 - DEPTH_ALPHA_FLOOR) * depthT;
          pWidth[s] = CORE_WIDTH * (0.45 + 0.95 * depthT);
        }

        const rgb = curve.isAccent ? ACCENT_COLOR : "255, 255, 255";
        const baseAlpha = curve.alpha * (curve.isAccent ? ACCENT_ALPHA_SCALE : 1);
        const perBand = SAMPLES / BANDS;

        // Two passes: a wide dim halo, then the narrow core over it. Softness
        // without a blur, and resolution-independent.
        for (let pass = 0; pass < 2; pass++) {
          const isHalo = pass === 0;
          for (let b = 0; b < BANDS; b++) {
            const start = Math.round(b * perBand);
            const end = Math.round((b + 1) * perBand);

            let aSum = 0;
            let wSum = 0;
            for (let s = start; s <= end; s++) {
              aSum += pAlpha[s];
              wSum += pWidth[s];
            }
            const count = end - start + 1;
            const bandAlpha = (aSum / count) * baseAlpha;
            const bandWidth = wSum / count;

            ctx.beginPath();
            ctx.moveTo(px[start], py[start]);
            for (let s = start + 1; s <= end; s++) ctx.lineTo(px[s], py[s]);

            ctx.lineWidth = isHalo ? bandWidth * HALO_WIDTH_SCALE : bandWidth;
            ctx.strokeStyle = `rgba(${rgb}, ${
              isHalo ? bandAlpha * HALO_ALPHA_SHARE : bandAlpha
            })`;
            ctx.stroke();
          }
        }
      }
    };

    let rafId: number | null = null;
    let startTime: number | null = null;
    let hiddenAt: number | null = null;

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
      if (document.hidden) {
        hiddenAt = performance.now();
        stop();
      } else {
        // Roll `startTime` forward by however long the tab was hidden.
        // Elapsed time is wall-clock, so without this the first frame back
        // is drawn at `t + hiddenDuration` and the bundle cuts to a whole
        // new configuration the instant you return to the tab. rAF
        // timestamps share `performance.now()`'s time origin, so the two
        // are directly comparable.
        if (hiddenAt !== null && startTime !== null) {
          startTime += performance.now() - hiddenAt;
        }
        hiddenAt = null;
        start();
      }
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
