"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./MotionPreference";

/**
 * WaveField
 * ---------
 * Site-wide ambient background: filaments defined in 3D, drifting behind all
 * page content. Single `<canvas>` driven by rAF, fixed at `z-0`.
 *
 * Four ideas carry the whole effect.
 *
 * 1. It is genuinely three-dimensional. Every curve is a point set in
 *    (x, y, z), rotated and perspective-projected, so depth drives stroke
 *    width, brightness and focus. Strands sweep toward and away from the
 *    viewer and pass through one another instead of sliding across a plane.
 *
 * 2. It is layered, and the layers are independent. `LAYERS` defines three
 *    strata at different depths, each tumbling on its OWN axes at its own
 *    rate. A single rigid bundle can only translate and shear; separate
 *    strata slide across each other, so the crossing pattern between them
 *    keeps reorganising. That parallax — grids in relative motion — is what
 *    reads as psychedelic, and it comes from structure rather than from
 *    colour or speed, which is what keeps it calm enough to sit behind text.
 *
 * 3. The strands are a family, not a crowd. Two species (`arc`, `filament`)
 *    give long structural sweeps and a woven mid-ground, and within a layer
 *    both frequency and phase are pulled partway toward shared values
 *    (`COHERENCE`), so neighbours read as the same wave arriving slightly
 *    later. Fully independent curves looked like a pile that happened to
 *    share a frame. Only partway, though: identical strands would be
 *    periodic and mirror-symmetric.
 *
 * 4. It answers the page, through its ANIMATION rather than its position.
 *    Scroll is a second time axis: each stratum scrubs its own evolution at
 *    its own rate, so scrolling slides them through each other's
 *    configurations and scrolling back rewinds it. Scroll speed also swells
 *    the field briefly. Nothing translates — an earlier version slid the
 *    strata down the screen and that read as the background coming loose.
 *    See `SCROLL_TIME_GAIN` / `ENERGY_GAIN`.
 *
 * Two earlier problems worth not reintroducing:
 *
 * - The field was once a flat horizontal band across the middle of the frame,
 *   which read as a sound-wave graphic — the one thing an ambient background
 *   on a music-adjacent site must not look like.
 * - Its fade was a screen-space linear gradient masking a fixed fraction of
 *   each edge. Rectangular and axis-aligned while nothing else was, it read
 *   as a vertical band of haze rather than as lines ending. Fading is purely
 *   a function of DEPTH now, and curves extend past the frame, so there is
 *   nothing to mask at the edges at all.
 *
 * Contrast hierarchy — the constraint the tuning serves. The structural
 * hairline (`--color-border`, white at 0.07) composites to luminance 25 over
 * the #080808 page. The rule is per-percentile, not per-pixel: the BODY of
 * the field stays under that, while isolated additive crossings may reach or
 * pass it. A small soft node reads as light; a continuous strand at rule
 * brightness reads as another edge in the layout, which is what made an
 * earlier version collide with the text. Constraining the PEAK instead drove
 * the typical strand to alpha 2/255 and the field vanished — so tune against
 * percentiles, never the maximum.
 *
 * Measured composited luminance at 1440x900 (actual RGBA composited over the
 * page, NOT alpha treated as white — under `lighter` both colour and alpha
 * accumulate, and the strands are tinted, so an alpha proxy misreports both
 * ends): p50 8, p90 10, p99 19, p99.9 31, max 51. Worst-case contrast for
 * #efefef text over the brightest pixel in the field is 10.9:1, against 17.4
 * on the bare background — still comfortably past WCAG AAA's 7:1, which is
 * the number that actually bounds how visible this layer is allowed to get.
 *
 * Visibility comes from the bloom pass (area), not from raising the core
 * (peak). See `BLOOM_ALPHA_SHARE`.
 *
 * Softness is three strokes per curve — bloom, halo, core. An earlier version
 * rendered to a half-resolution offscreen canvas and upscaled; bilinear
 * upscaling of hairlines is uneven, and that unevenness was itself part of
 * why the transparency looked wrong.
 */

/** Contiguous alpha bands per curve.
 *
 * Depth alpha varies continuously along a curve, but stroking every segment
 * separately would double-blend at every antialiased seam and bead the line
 * under additive compositing. Banding groups them into one path per depth
 * step, so only the band boundaries meet.
 *
 * Those boundaries MUST be stroked with `butt` caps. Adjacent bands share a
 * vertex, so with `round` caps two half-linewidth discs land on top of each
 * other and self-add — and since the halo pass is several times wider than
 * the core, that produces a string of bright blobs down every curve at
 * exactly the band spacing. `butt` makes the bands abut instead of overlap.
 * Interior joins still use `round`, which is unaffected. */
const BANDS = 12;

/** Samples per curve, by species. Sized to each species' own frequency
 * content rather than one global number: an `arc` carries well under a cycle
 * and is smooth at 40, while a `filament` runs to ~6.7 cycles and facets
 * visibly below ~15 samples per cycle. Spending arc samples on arcs would be
 * pure cost. */
const SAMPLES_ARC = 44;
const SAMPLES_FILAMENT = 130;
const SAMPLES_MAX = Math.max(SAMPLES_ARC, SAMPLES_FILAMENT);

/** How far each strand is pulled toward the family, 0..1.
 *
 * Frequencies converge on `FAMILY_FREQ` and phases onto a steady per-index
 * progression, so neighbours become near-copies of each other offset in time
 * and the bundle reads as one travelling system instead of unrelated lines.
 *
 * Deliberately partway. At 1 the strands are identical but shifted, which is
 * periodic and mirror-symmetric — the exact thing the irrational frequency
 * spread exists to prevent. At 0 nothing relates to anything. */
const COHERENCE = 0.45;
const FAMILY_FREQ = 1.25;
const PHASE_STEP = 0.62;

/** Scroll coupling.
 *
 * Scroll drives the field's ANIMATION, not its position. An earlier version
 * translated the strata down the screen as you scrolled; even at a bounded
 * 134px that reads as the background sliding out from under the page, which
 * is jarring rather than atmospheric.
 *
 * Instead scroll is a second time axis. `SCROLL_TIME_GAIN` is how many extra
 * radians of evolution a full document's worth of scrolling adds, scaled per
 * stratum by `LAYERS[].scrollResponse`. Because each layer scrubs at its own
 * rate, scrolling slides them through each other's configurations — the
 * field reorganises rather than moves, and scrolling back rewinds it. The
 * ambient drift keeps running underneath, so the field never freezes when
 * the page is still.
 *
 * `ENERGY_*` is the transient: scroll velocity briefly swells amplitude and
 * twist, so a flick makes the field surge and settle instead of tilting.
 * Damped per frame and capped, so a trackpad fling cannot throw it. */
const SCROLL_TIME_GAIN = 5.5;
/** How fast the scrubbed phase chases the scroll position. Damped rather
 * than applied outright: `progress` moves smoothly under a continuous
 * scroll, but a PageDown, an anchor jump or a scrollbar drag moves it in
 * one step, and feeding that straight into the phase snaps the whole field
 * to a new configuration in a single frame. Chasing it ramps that over a
 * few hundred milliseconds instead, and the slight lag under continuous
 * scrolling reads as the field having weight. */
const SCROLL_PHASE_DAMPING = 0.07;
const ENERGY_GAIN = 0.0042;
const ENERGY_MAX = 0.5;
const ENERGY_DAMPING = 0.11;

/** Half-extent of a filament along its own axis, in units of half the
 * viewport. Greater than 1 so both ends sit outside the frame: strands enter
 * and leave like light trails instead of needing an edge mask. */
const SPAN = 1.6;

/** Peak lateral excursion of a filament, as a fraction of viewport height. */
const AMPLITUDE_RATIO = 0.15;

/** Depth excursion, in projection units — the volume the bundle occupies.
 * Without it the rotations below would only shear a flat sheet. */
const DEPTH_RATIO = 1.05;

/** Bounds on rotated depth, and the camera distance for the perspective
 * divide.
 *
 * `FOCAL` MUST exceed `Z_FAR_LIMIT`, with margin. Rotated depth is not
 * bounded by `DEPTH_RATIO`: rotating about Y folds a curve's own axis into z,
 * so the result picks up `SPAN * sin(rotY)` and `ly * sin(rotX)` on top of
 * `lz` and the layer's own depth offset, reaching about ±4 at these
 * amplitudes. With a shorter focal length, `FOCAL + z` crosses zero, the
 * divide flips sign, and single segments fire across the whole frame.
 *
 * The near bound is tighter than the far one, which is not symmetry for its
 * own sake. Screen distance per sample scales with `persp`, so a curve close
 * to the lens is stretched by exactly the factor that thins out its sampling
 * — a high-frequency filament in the near stratum out-runs its own sample
 * count and comes apart into visible facets and spikes. Capping how close
 * anything may come costs a little depth range and removes that entirely.
 * The resulting scale ratio between the extremes is still about 2.5x. */
const Z_NEAR_LIMIT = 2.6;
const Z_FAR_LIMIT = 4.1;
const FOCAL = 7;

/** Master clock — radians of phase per millisecond. Everything else is a
 * ratio of this, so the whole field retimes from one number. */
const TIME_SCALE = 0.00016;

/** Helical twist: phase advances along a filament's own length, so it winds
 * around its axis instead of undulating in a plane. With the layer tumble,
 * this is most of what makes the crossings read as three-dimensional. */
const TWIST_SPEED = 0.31;
const TWIST_AMP = 1.35;

/** Amplitude breathing and baseline wander, each at its own incommensurate
 * rate, so a curve's form keeps changing rather than only its position. */
const BREATHE_SPEED = 0.23;
const BREATHE_DEPTH = 0.4;
const WANDER_SPEED = 0.17;
const WANDER_RATIO = 0.07;

/** Stroke alpha range at mid-depth, before the depth and layer terms. Low
 * because there are many curves: density is meant to buy structure and
 * interference, not brightness. Tuned against the composited percentiles in
 * the header note. */
const BASE_ALPHA_MIN = 0.096;
const BASE_ALPHA_MAX = 0.168;

/** How much depth darkens a curve: the far extreme keeps this fraction of its
 * brightness, the near extreme keeps all of it. This replaces the old
 * screen-space edge mask entirely. */
const DEPTH_ALPHA_FLOOR = 0.1;

/** Core stroke width in CSS px at unit depth, and the alpha the halo under it
 * carries. The halo's WIDTH is per-layer (see `LAYERS`), which is what gives
 * the field depth of field. */
const CORE_WIDTH = 1.05;
const HALO_ALPHA_SHARE = 0.26;

/** The bloom: a third stroke, far wider than the halo and far fainter, laid
 * down first. This is the field's visibility budget. Perceived presence
 * tracks covered AREA much more than peak brightness, and an edgeless wash
 * cannot be misread as one of the page's hairlines however visible it
 * becomes — whereas buying the same presence by brightening the core would
 * put strands back in competition with the rules.
 *
 * Its alpha has to stay very low: every curve contributes one, they overlap
 * additively, and if the accumulated wash lifts the page background then
 * text contrast drops everywhere. That is the number to watch when tuning —
 * not how the bloom looks on its own. */
const BLOOM_WIDTH_SCALE = 3.2;
const BLOOM_ALPHA_SHARE = 0.30;
const BLOOM_BANDS = 4;

/** Extra halo spread applied to the far end of a curve's own depth range, on
 * top of its layer's. Within a single curve, the receding end goes softer
 * than the approaching end — the cue that sells depth along a strand rather
 * than only between strata. */
const DEFOCUS_BY_DEPTH = 1.7;

/** Cap on devicePixelRatio.
 *
 * Deliberately below 2. This is a soft, low-contrast, out-of-focus layer with
 * no hard edges to alias, so the extra backing store a retina display asks
 * for buys nothing visible while costing fill on every stroke — and there are
 * several hundred per frame. Biggest single lever on draw cost. */
const MAX_DPR = 1.5;

/** Accent tint carried by a few curves, at very low alpha.
 *
 * This is `--accent` from `globals.css` as an rgb triple, since canvas needs
 * components rather than a hex. Note this design renamed the brand blue:
 * `--color-primary` is an alias of `--accent`, not a second colour, so there
 * is exactly one blue on the site and this is it. (`AGENTS.md` still
 * documents the previous site's `#0d6efd`.) Keep in step with the token. */
const ACCENT_COLOR = "37, 99, 235"; // #2563eb
const ACCENT_ALPHA_SCALE = 0.5;

/** `FREQ_SCALE` sets how many times a filament crosses its own axis across
 * the frame. Low values give a handful of lazy swooshes; strands only start
 * to weave — to cross often enough that the crossings form a moving
 * interference pattern — once each carries a few cycles. */
const FREQ_SCALE = 2.7;
const FREQ_RATIOS = [1, 1.37, 1.71, 2.13, 0.79, 1.53, 2.31, 0.61, 1.19, 1.83, 0.93, 2.47];
const SECOND_FREQ_RATIOS = [0.31, 0.47, 0.19, 0.53, 0.37, 0.29, 0.43, 0.23, 0.41, 0.59, 0.17, 0.51];
const DEPTH_FREQ_RATIOS = [0.63, 0.91, 1.24, 0.48, 1.07, 0.72, 1.41, 0.86, 0.57, 1.13, 0.79, 1.32];

type Species = "arc" | "filament";

/** The three strata.
 *
 * Each rotates on its own axes at its own rate, and the rates are mutually
 * incommensurate, so no two layers ever return to the same relative
 * orientation. This is the source of the field's slow reorganisation: a
 * single bundle can only translate, whereas independent strata slide across
 * one another and their crossing pattern is never the same twice.
 *
 * `haloScale` is depth of field. The far stratum is drawn with a much wider,
 * softer halo relative to its core, the near one tight and defined, so the
 * layers separate perceptually even where they overlap.
 *
 * `tint` is atmospheric perspective: distance mixes a strand toward the
 * accent blue, the way haze cools anything far away. It is the one place
 * colour enters the field, it stays on the single brand hue, and it does
 * real work — a cool far stratum against a white near one separates depth
 * far more cheaply than brightness alone can. */
const LAYERS = [
  {
    depth: 0.62,
    rotYSpeed: 0.31,
    rotYAmp: 0.4,
    rotXSpeed: 0.19,
    rotXAmp: 0.15,
    rotPhase: 0,
    alphaScale: 0.62,
    widthScale: 0.7,
    haloScale: 5.4,
    tint: 0.55,
    scrollResponse: 0.35,
  },
  {
    depth: 0,
    rotYSpeed: 0.42,
    rotYAmp: 0.55,
    rotXSpeed: 0.27,
    rotXAmp: 0.22,
    rotPhase: 1.7,
    alphaScale: 1,
    widthScale: 1,
    haloScale: 3.6,
    tint: 0.22,
    scrollResponse: 0.7,
  },
  {
    depth: -0.54,
    rotYSpeed: 0.57,
    rotYAmp: 0.56,
    rotXSpeed: 0.36,
    rotXAmp: 0.23,
    rotPhase: 3.4,
    alphaScale: 1.22,
    widthScale: 1.3,
    haloScale: 2.5,
    tint: 0,
    scrollResponse: 1.25,
  },
];

/** Mixes white toward the accent by `t`, returning an "r, g, b" triple. */
function tintedRgb(t: number): string {
  const r = Math.round(255 + (37 - 255) * t);
  const g = Math.round(255 + (99 - 255) * t);
  const b = Math.round(255 + (235 - 255) * t);
  return `${r}, ${g}, ${b}`;
}

const LAYER_RGB = LAYERS.map((l) => tintedRgb(l.tint));

/** Species population per layer: [arcs, filaments].
 *
 * Weighted toward filaments on purpose. An arc is the strongest shape in the
 * field — a long sweep crossing the whole frame — so a handful reads as
 * structure, while a crowd of them reads as tangled string. The far stratum
 * carries the sweeps and the mid is the woven body.
 *
 * There used to be a third species: a closed ring. It was the clearest depth
 * cue available, but it was the only closed form in a field of open curves
 * and it read as an ellipse someone had left lying there rather than as part
 * of the same system. Coherence beat the depth cue; the tumbling, the bloom
 * and the atmospheric tint carry depth on their own. */
const LAYER_POPULATION: [number, number][] = [
  [4, 3],
  [1, 8],
  [0, 4],
];

interface CurveConfig {
  species: Species;
  layer: number;
  samples: number;
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
  xOffset: number;
  alpha: number;
  isAccent: boolean;
}

function buildCurves(): CurveConfig[] {
  const curves: CurveConfig[] = [];
  let i = 0;

  LAYER_POPULATION.forEach(([arcs, filaments], layer) => {
    const species: Species[] = [
      ...Array<Species>(arcs).fill("arc"),
      ...Array<Species>(filaments).fill("filament"),
    ];

    species.forEach((kind, indexInLayer) => {
      // Deterministic per-curve pseudo-randomness from the running index, so
      // the field is stable across reloads without a seeded RNG dependency.
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const frac = seed - Math.floor(seed);
      const seed2 = Math.sin(i * 78.233) * 24634.6345;
      const frac2 = seed2 - Math.floor(seed2);

      // Arcs are the structural sweeps: well under a cycle across the frame,
      // wide and slow. Filaments carry the weave.
      //
      // Frequency is pulled partway toward a shared family value. Fully
      // independent ratios gave every strand its own unrelated rhythm, so the
      // field read as a pile of curves that happened to share a frame;
      // pulling them together makes neighbours beat slowly against each other
      // instead, which is what makes them look like one system. Only
      // partway — identical frequencies would make the bundle periodic and
      // mirror-symmetric, which is what the irrational spread existed to
      // prevent in the first place.
      const rawFreq = FREQ_RATIOS[i % FREQ_RATIOS.length];
      const freqBase = rawFreq + (FAMILY_FREQ - rawFreq) * COHERENCE;
      const freq = kind === "arc" ? freqBase * 0.28 : freqBase * FREQ_SCALE;

      // Phase advances steadily with position in the layer, blended against
      // the curve's own random phase. Neighbouring strands then read as the
      // same wave arriving slightly later — the cue that groups them into a
      // travelling family rather than unrelated lines.
      const rawPhase = frac * Math.PI * 2;
      const familyPhase = indexInLayer * PHASE_STEP + layer * 0.9;
      const phase = rawPhase + (familyPhase - rawPhase) * COHERENCE;

      // Amplitude rolls off with frequency, the way a real spectrum does.
      // Flat amplitude across all frequencies is what made the fastest
      // filaments spike: at ~6.7 cycles the wavelength is about 216px while
      // the excursion was about 207px, so each cycle was as tall as it was
      // wide — a steep zigzag rather than a wave, and one that turned up to
      // 163 degrees between adjacent samples. Tying amplitude to 1/frequency
      // gives fast curves shallow ripples and slow curves broad sweeps, which
      // is both what stops the spiking and what makes the bundle read as one
      // spectrum instead of a pile of unrelated curves.
      // Clamped at both ends. Unbounded, 1/freq hands the slowest filament a
      // ~1.9x multiplier, which makes it wider than the arcs and brings back
      // exactly the giant sweeps this pass set out to tame.
      const ampRolloff =
        kind === "arc" ? 1 : Math.min(1.3, Math.max(0.6, 1.15 / freqBase));

      const count = species.length;
      curves.push({
        species: kind,
        layer,
        samples: kind === "arc" ? SAMPLES_ARC : SAMPLES_FILAMENT,
        freq,
        freq2:
          SECOND_FREQ_RATIOS[i % SECOND_FREQ_RATIOS.length] *
          (kind === "arc" ? 0.4 : FREQ_SCALE),
        depthFreq: DEPTH_FREQ_RATIOS[i % DEPTH_FREQ_RATIOS.length],
        phase,
        phase2: (1 - frac) * Math.PI * 2,
        depthPhase: frac2 * Math.PI * 2,
        breathePhase: ((frac * 7) % 1) * Math.PI * 2,
        wanderPhase: ((frac * 5) % 1) * Math.PI * 2,
        twistPhase: ((frac2 * 3) % 1) * Math.PI * 2,
        ampScale: ((kind === "arc" ? 0.85 : 0.55) + frac * 0.7) * ampRolloff,
        depthScale: 0.45 + frac2 * 0.95,
        // Spread resting positions across the frame, nudged off-grid per
        // curve so a layer never looks like evenly ruled staff lines.
        yOffset: (indexInLayer - (count - 1) / 2) * 0.3 + (frac - 0.5) * 0.14,
        xOffset: (frac2 - 0.5) * 0.7,
        alpha: BASE_ALPHA_MIN + frac2 * (BASE_ALPHA_MAX - BASE_ALPHA_MIN),
        isAccent: i % 7 === 2,
      });

      i++;
    });
  });

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

    // Projected sample buffers, reused every frame so the draw loop allocates
    // nothing. Sized to the largest species.
    const px = new Float32Array(SAMPLES_MAX + 1);
    const py = new Float32Array(SAMPLES_MAX + 1);
    const pAlpha = new Float32Array(SAMPLES_MAX + 1);
    const pWidth = new Float32Array(SAMPLES_MAX + 1);
    const pDefocus = new Float32Array(SAMPLES_MAX + 1);

    // Document scroll extent, cached. `scrollHeight`/`clientHeight` are
    // layout-dependent reads and can force a synchronous layout, which is not
    // something a full-viewport loop should do 60 times a second. Only
    // `scrollY` is genuinely per-frame; this is refreshed whenever the
    // document actually changes size.
    let scrollable = 1;
    const measureScrollExtent = () => {
      const doc = document.documentElement;
      scrollable = Math.max(1, doc.scrollHeight - doc.clientHeight);
    };

    const resize = () => {
      // A bare `<canvas>` with no explicit size is a replaced element with an
      // intrinsic 300x150 box — `fixed inset-0` alone does not stretch it.
      // Force it to fill its fixed box via CSS percentages first, then measure
      // that box. Never `window.innerWidth`: that includes the scrollbar
      // gutter, which made the canvas wider than the page and put a horizontal
      // scrollbar on every route.
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const rect = canvas.getBoundingClientRect();
      width = rect.width || document.documentElement.clientWidth;
      height = rect.height || document.documentElement.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // See the BANDS note: round caps at shared band boundaries overlap and
      // self-add under `lighter`, beading every curve at the band spacing.
      ctx.lineCap = "butt";
      ctx.lineJoin = "round";
      measureScrollExtent();
    };

    // Scroll state, persisted across frames.
    let lastScrollY = typeof window === "undefined" ? 0 : window.scrollY;
    let energy = 0;
    let scrollPhase = 0;

    resize();

    const draw = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      // Additive: where curves cross they sum, so the nodes bloom on their
      // own. It is also order-independent, which is why the field needs no
      // depth sorting despite being genuinely 3D.
      ctx.globalCompositeOperation = "lighter";

      const t = timeMs * TIME_SCALE;
      const cx = width / 2;
      const cy = height / 2;
      const halfW = width / 2;
      const halfH = height / 2;
      const ampPx = height * AMPLITUDE_RATIO;

      const perspNear = FOCAL / (FOCAL - Z_NEAR_LIMIT);
      const perspFar = FOCAL / (FOCAL + Z_FAR_LIMIT);
      const perspSpan = perspNear - perspFar || 1;

      // Scroll coupling. `scrollY` is read once per frame here rather than
      // from a scroll listener: the loop is already running, one read cannot
      // fire more often than a paint, and it keeps the two in lockstep so the
      // field never lags the page by a frame. The document extent it is
      // divided by is cached — see `measureScrollExtent`.
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Speed, not direction: scrolling either way is agitation. Smoothed and
      // capped so the surge builds and settles instead of snapping.
      energy +=
        (Math.min(ENERGY_MAX, Math.abs(delta) * ENERGY_GAIN) - energy) * ENERGY_DAMPING;

      // Each stratum's orientation for this frame, computed once rather than
      // per curve. `layerTime` is the stratum's own clock: ambient drift plus
      // the scroll offset scaled by how strongly this layer answers scroll.
      // Because the three rates differ, scrolling slides the strata through
      // each other's configurations instead of moving any of them.
      scrollPhase += (progress * SCROLL_TIME_GAIN - scrollPhase) * SCROLL_PHASE_DAMPING;
      const layerState = LAYERS.map((layer) => {
        const lt = t + scrollPhase * layer.scrollResponse;
        const rotY = layer.rotYAmp * Math.sin(lt * layer.rotYSpeed + layer.rotPhase);
        const rotX = layer.rotXAmp * Math.sin(lt * layer.rotXSpeed + layer.rotPhase + 1.1);
        return {
          lt,
          cosY: Math.cos(rotY),
          sinY: Math.sin(rotY),
          cosX: Math.cos(rotX),
          sinX: Math.sin(rotX),
        };
      });

      for (const curve of curves) {
        const layer = LAYERS[curve.layer];
        const { lt, cosY, sinY, cosX, sinX } = layerState[curve.layer];

        const breathe = 1 + BREATHE_DEPTH * Math.sin(lt * BREATHE_SPEED + curve.breathePhase);
        const wander = WANDER_RATIO * Math.sin(lt * WANDER_SPEED + curve.wanderPhase);
        // Scroll energy swells the twist and the excursion together, so a
        // flick makes the whole family surge rather than shift.
        const twist = lt * TWIST_SPEED + curve.twistPhase + energy * 0.9;
        const amp = ampPx * curve.ampScale * breathe * (1 + energy * 0.35);
        const ampNorm = amp / halfH;
        const samples = curve.samples;

        for (let s = 0; s <= samples; s++) {
          // u runs -1..1 along the curve's own axis.
          const u = (s / samples) * 2 - 1;
          const wave =
            Math.sin(u * Math.PI * curve.freq + curve.phase + lt) +
            0.45 * Math.sin(u * Math.PI * 2 * curve.freq2 + curve.phase2 - lt * 0.73);
          const twistAngle = u * TWIST_AMP + twist;

          const lx = u * SPAN + curve.xOffset * 0.3;
          const ly = (curve.yOffset + wander) * 2 + wave * Math.cos(twistAngle) * ampNorm;
          let lz =
            DEPTH_RATIO *
            curve.depthScale *
            (Math.sin(u * Math.PI * curve.depthFreq + curve.depthPhase + lt * 0.61) * 0.65 +
              wave * Math.sin(twistAngle) * 0.35);

          // Push the whole curve into its stratum's depth slot.
          lz += layer.depth;

          // Rotate about Y, then about X.
          const rx1 = lx * cosY + lz * sinY;
          const rz1 = -lx * sinY + lz * cosY;
          const ry2 = ly * cosX - rz1 * sinX;
          // Clamped so the divide can never approach zero, and so nothing
          // comes close enough to the lens to out-run its sampling — see the
          // Z_NEAR_LIMIT / Z_FAR_LIMIT note.
          const rz2 = Math.min(
            Z_FAR_LIMIT,
            Math.max(-Z_NEAR_LIMIT, ly * sinX + rz1 * cosX),
          );

          const persp = FOCAL / (FOCAL + rz2);
          const depthT = Math.min(1, Math.max(0, (persp - perspFar) / perspSpan));

          px[s] = cx + rx1 * halfW * persp;
          py[s] = cy + ry2 * halfH * persp;
          pAlpha[s] = DEPTH_ALPHA_FLOOR + (1 - DEPTH_ALPHA_FLOOR) * depthT;
          pWidth[s] = CORE_WIDTH * layer.widthScale * (0.45 + 0.95 * depthT);
          // Receding end of the curve defocuses; approaching end sharpens.
          pDefocus[s] = 1 + DEFOCUS_BY_DEPTH * (1 - depthT);
        }

        // Accent curves are the fully-saturated exception; everything else
        // takes its stratum's atmospheric tint, so distance reads as cooler.
        const rgb = curve.isAccent ? ACCENT_COLOR : LAYER_RGB[curve.layer];
        const baseAlpha =
          curve.alpha * layer.alphaScale * (curve.isAccent ? ACCENT_ALPHA_SCALE : 1);

        // Three passes, widest and faintest first: bloom, halo, core.
        //
        // The bloom is what makes the field readable. Perceived presence
        // tracks the AREA a thing covers far more than its peak brightness,
        // and a very wide, very faint stroke has no edge, so it can never be
        // mistaken for one of the page's hairlines no matter how visible it
        // gets. Raising the core's alpha instead would buy the same presence
        // by making individual strands compete with the rules — which is the
        // exact failure this field started with. Under additive compositing
        // the blooms of nearby strands also pool where several converge, so
        // the crossings glow as regions rather than as points.
        //
        // The bloom uses far fewer bands than the core: it has no detail to
        // resolve, so per-band depth accuracy is wasted on it, and this keeps
        // the extra pass cheap.
        for (let pass = 0; pass < 3; pass++) {
          const isBloom = pass === 0;
          const isHalo = pass === 1;
          const bands = isBloom ? BLOOM_BANDS : BANDS;
          const step = samples / bands;

          for (let b = 0; b < bands; b++) {
            const start = Math.round(b * step);
            const end = Math.round((b + 1) * step);
            if (end <= start) continue;

            let aSum = 0;
            let wSum = 0;
            let dSum = 0;
            for (let s = start; s <= end; s++) {
              aSum += pAlpha[s];
              wSum += pWidth[s];
              dSum += pDefocus[s];
            }
            const count = end - start + 1;
            const bandAlpha = (aSum / count) * baseAlpha;
            const bandWidth = wSum / count;
            const bandDefocus = dSum / count;

            ctx.beginPath();
            ctx.moveTo(px[start], py[start]);
            for (let s = start + 1; s <= end; s++) ctx.lineTo(px[s], py[s]);

            if (isBloom) {
              ctx.lineWidth = bandWidth * layer.haloScale * BLOOM_WIDTH_SCALE * bandDefocus;
              ctx.strokeStyle = `rgba(${rgb}, ${
                (bandAlpha * BLOOM_ALPHA_SHARE) / bandDefocus
              })`;
            } else if (isHalo) {
              ctx.lineWidth = bandWidth * layer.haloScale * bandDefocus;
              // Spreading the halo wider must not also make it brighter, so
              // its alpha is divided back down by the same defocus factor.
              ctx.strokeStyle = `rgba(${rgb}, ${
                (bandAlpha * HALO_ALPHA_SHARE) / bandDefocus
              })`;
            } else {
              ctx.lineWidth = bandWidth;
              ctx.strokeStyle = `rgba(${rgb}, ${bandAlpha})`;
            }
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
        // Elapsed time is wall-clock, so without this the first frame back is
        // drawn at `t + hiddenDuration` and the field cuts to a whole new
        // configuration the instant you return to the tab. rAF timestamps
        // share `performance.now()`'s time origin, so the two are directly
        // comparable.
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
      // `body`, not `documentElement`: the root's observed content box is
      // effectively the layout viewport, so it need not change when the
      // document grows taller (late-loading images, expanding content). The
      // cached scroll extent would then go stale and the parallax would map
      // scroll position against the wrong document height.
      resizeObserver.observe(document.body);
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
