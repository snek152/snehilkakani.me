"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { RELEASE_MS } from "../loader/OrbitStage";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "./MotionPreference";

const INTRO_DRAW_MS = beats(2) * 1000;

const BANDS = 12;

const SAMPLES_ARC = 44;
const SAMPLES_FILAMENT = 130;
const SAMPLES_MAX = Math.max(SAMPLES_ARC, SAMPLES_FILAMENT);

const COHERENCE = 0.45;
const FAMILY_FREQ = 1.25;
const PHASE_STEP = 0.62;

const SCROLL_TIME_PER_PX = 0.0016;

const SCROLL_PHASE_DAMPING = 0.055;
const ENERGY_GAIN = 0.0024;
const ENERGY_MAX = 0.32;
const ENERGY_DAMPING = 0.09;

const SPAN = 1.6;

const AMPLITUDE_RATIO = 0.15;

const DEPTH_RATIO = 1.05;

const Z_NEAR_LIMIT = 2.6;
const Z_FAR_LIMIT = 4.1;
const FOCAL = 7;

const TIME_SCALE = 0.00016;

const TWIST_SPEED = 0.31;
const TWIST_AMP = 1.35;

const BREATHE_SPEED = 0.23;
const BREATHE_DEPTH = 0.4;
const WANDER_SPEED = 0.17;
const WANDER_RATIO = 0.07;

const BASE_ALPHA_MIN = 0.08;
const BASE_ALPHA_MAX = 0.145;

const DEPTH_ALPHA_FLOOR = 0.1;

const CORE_WIDTH = 1.05;
const HALO_ALPHA_SHARE = 0.26;

const BLOOM_WIDTH_SCALE = 3.2;
const BLOOM_ALPHA_SHARE = 0.26;
const BLOOM_BANDS = 4;

const DEFOCUS_BY_DEPTH = 1.7;

const MAX_DPR = 1.5;

const ACCENT_COLOR = "37, 99, 235";
const ACCENT_ALPHA_SCALE = 0.5;

const FREQ_SCALE = 2.7;
const FREQ_RATIOS = [1, 1.37, 1.71, 2.13, 0.79, 1.53, 2.31, 0.61, 1.19, 1.83, 0.93, 2.47];
const SECOND_FREQ_RATIOS = [0.31, 0.47, 0.19, 0.53, 0.37, 0.29, 0.43, 0.23, 0.41, 0.59, 0.17, 0.51];
const DEPTH_FREQ_RATIOS = [0.63, 0.91, 1.24, 0.48, 1.07, 0.72, 1.41, 0.86, 0.57, 1.13, 0.79, 1.32];

type Species = "arc" | "filament";

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

function tintedRgb(t: number): string {
  const r = Math.round(255 + (37 - 255) * t);
  const g = Math.round(255 + (99 - 255) * t);
  const b = Math.round(255 + (235 - 255) * t);
  return `${r}, ${g}, ${b}`;
}

const LAYER_RGB = LAYERS.map((l) => tintedRgb(l.tint));

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
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const frac = seed - Math.floor(seed);
      const seed2 = Math.sin(i * 78.233) * 24634.6345;
      const frac2 = seed2 - Math.floor(seed2);

      const rawFreq = FREQ_RATIOS[i % FREQ_RATIOS.length];
      const freqBase = rawFreq + (FAMILY_FREQ - rawFreq) * COHERENCE;
      const freq = kind === "arc" ? freqBase * 0.28 : freqBase * FREQ_SCALE;
      const rawPhase = frac * Math.PI * 2;
      const familyPhase = indexInLayer * PHASE_STEP + layer * 0.9;
      const phase = rawPhase + (familyPhase - rawPhase) * COHERENCE;
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

export default function WaveField({
  staged = false,
  introReady = true,
  awaitCurtain = false,
}: {
  staged?: boolean;
  introReady?: boolean;
  awaitCurtain?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useMotionPreference();
  const startedRef = useRef(false);
  const introRef = useRef<boolean | null>(null);
  if (introRef.current === null) introRef.current = staged && !reduceMotion;

  const [bright, setBright] = useState(() => !introRef.current);
  const [clipOpen, setClipOpen] = useState(() => !introRef.current);
  const settleRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!introRef.current || !introReady) return;
    if (!awaitCurtain) {
      setClipOpen(true);
      return;
    }
    const timer = window.setTimeout(() => setClipOpen(true), RELEASE_MS);
    return () => window.clearTimeout(timer);
  }, [introReady, awaitCurtain]);

  useEffect(() => {
    if (staged) return;
    setClipOpen(true);
    settleRef.current?.();
  }, [staged]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const curves = buildCurves();
    let width = 0;
    let height = 0;
    const px = new Float32Array(SAMPLES_MAX + 1);
    const py = new Float32Array(SAMPLES_MAX + 1);
    const pAlpha = new Float32Array(SAMPLES_MAX + 1);
    const pWidth = new Float32Array(SAMPLES_MAX + 1);
    const pDefocus = new Float32Array(SAMPLES_MAX + 1);

    const resize = () => {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const rect = canvas.getBoundingClientRect();
      width = rect.width || document.documentElement.clientWidth;
      height = rect.height || document.documentElement.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.lineCap = "butt";
      ctx.lineJoin = "round";
    };

    let lastScrollY = typeof window === "undefined" ? 0 : window.scrollY;
    let energy = 0;
    let scrollPhase = 0;
    resize();

    const draw = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);

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
      const scrollTarget = Math.max(0, window.scrollY * SCROLL_TIME_PER_PX);
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      energy +=
        (Math.min(ENERGY_MAX, Math.abs(delta) * ENERGY_GAIN) - energy) * ENERGY_DAMPING;
      scrollPhase += (scrollTarget - scrollPhase) * SCROLL_PHASE_DAMPING;
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

        const twist = lt * TWIST_SPEED + curve.twistPhase + energy * 0.9;
        const amp = ampPx * curve.ampScale * breathe * (1 + energy * 0.35);
        const ampNorm = amp / halfH;
        const samples = curve.samples;
        for (let s = 0; s <= samples; s++) {
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

          lz += layer.depth;
          const rx1 = lx * cosY + lz * sinY;
          const rz1 = -lx * sinY + lz * cosY;
          const ry2 = ly * cosX - rz1 * sinX;
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

          pDefocus[s] = 1 + DEFOCUS_BY_DEPTH * (1 - depthT);
        }

        const rgb = curve.isAccent ? ACCENT_COLOR : LAYER_RGB[curve.layer];
        const baseAlpha =
          curve.alpha * layer.alphaScale * (curve.isAccent ? ACCENT_ALPHA_SCALE : 1);

        const drawProgress =
          isStagedIntro && clipOpen ? Math.min(1, timeMs / INTRO_DRAW_MS) : 1;
        const visibleSample = Math.max(1, Math.round(samples * drawProgress));
        for (let pass = 0; pass < 3; pass++) {
          const isBloom = pass === 0;
          const isHalo = pass === 1;
          const bands = isBloom ? BLOOM_BANDS : BANDS;
          const step = samples / bands;
          for (let b = 0; b < bands; b++) {
            const start = Math.round(b * step);
            const end = Math.min(visibleSample, Math.round((b + 1) * step));
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

    const isStagedIntro = introRef.current && !reduceMotion;
    if (reduceMotion) {
      setBright(true);
      setClipOpen(true);
      draw(0);
    } else if (isStagedIntro && !clipOpen) {
      draw(0);
    } else {
      startedRef.current = !isStagedIntro;
      start();
    }

    const handleVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        hiddenAt = performance.now();
        stop();
      } else {
        if (hiddenAt !== null && startTime !== null) {
          startTime += performance.now() - hiddenAt;
        }
        hiddenAt = null;
        if (!isStagedIntro || startedRef.current) start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleResize = () => {
      resize();
      draw(startTime === null ? 0 : performance.now() - startTime);
    };
    window.addEventListener("resize", handleResize);

    let handleScroll: (() => void) | null = null;
    if (isStagedIntro) {
      const settle = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        start();
        setBright(true);
      };
      handleScroll = settle;
      settleRef.current = settle;
      window.addEventListener("scroll", handleScroll, { passive: true, once: true });
    }

    return () => {
      stop();
      settleRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
    };
  }, [clipOpen, reduceMotion]);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      initial={introRef.current ? { opacity: 0.15 } : false}
      animate={{ opacity: bright ? 1 : 0.15 }}
      transition={reduceMotion ? { duration: 0 } : { duration: beats(0.75), ease: EASE_OUT }}
    />
  );
}
