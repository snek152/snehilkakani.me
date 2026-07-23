"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Fixed, full-viewport film-grain texture — a subtle "the medium is alive"
 * layer, on-brand for a photography site. A handful of noise tiles are
 * pre-rendered once to small offscreen canvases and cycled by swapping a
 * CSS `background-image` reference on an interval; nothing is redrawn or
 * re-rasterized per frame, so the cost per tick is a single cheap
 * compositor-level background swap rather than a canvas repaint.
 *
 * Disabled (frozen to one static tile) under reduced motion or on
 * coarse/touch pointers, mirroring CursorGlow's perf-conscious pattern.
 */

const TILE_SIZE = 96;
const FRAME_COUNT = 6;
const CYCLE_MS = 100;
const GRAIN_OPACITY = 0.04;

function makeNoiseTile(): string {
  const canvas = document.createElement("canvas");
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = ctx.createImageData(TILE_SIZE, TILE_SIZE);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = Math.random() * 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export default function FilmGrain() {
  const prefersReducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const count = prefersReducedMotion || isCoarsePointer ? 1 : FRAME_COUNT;
    setFrames(Array.from({ length: count }, () => makeNoiseTile()));
    setFrameIndex(0);
  }, [prefersReducedMotion, isCoarsePointer]);

  const animated = !prefersReducedMotion && !isCoarsePointer && frames.length > 1;

  useEffect(() => {
    if (!animated) return;
    intervalRef.current = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % frames.length);
    }, CYCLE_MS);
    return () => {
      window.clearInterval(intervalRef.current ?? undefined);
    };
  }, [animated, frames.length]);

  const backgroundImage = useMemo(() => {
    const src = frames[frameIndex];
    return src ? `url(${src})` : undefined;
  }, [frames, frameIndex]);

  if (!backgroundImage) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage,
        backgroundRepeat: "repeat",
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        opacity: GRAIN_OPACITY,
        mixBlendMode: "overlay",
      }}
    />
  );
}
