"use client";

import { Aperture, Binary, SlidersVertical, Terminal } from "lucide-react";
import { useMemo } from "react";
import { motion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { SWEEP_RADIAL } from "./DitherReveal";
import HalftoneHalo from "./HalftoneHalo";
import { EASE_OUT } from "@/app/lib/motion";

const RADIUS = 140;
export const RELEASE_MS = 800;

export const LOADER_MARKS = [
  {
    Icon: Terminal,
    label: "engineering",
    x: -RADIUS * Math.SQRT1_2,
    y: -RADIUS * Math.SQRT1_2,
    angle: -135,
  },
  {
    Icon: SlidersVertical,
    label: "music",
    x: RADIUS * Math.SQRT1_2,
    y: -RADIUS * Math.SQRT1_2,
    angle: -45,
  },
  {
    Icon: Aperture,
    label: "photography",
    x: RADIUS * Math.SQRT1_2,
    y: RADIUS * Math.SQRT1_2,
    angle: 45,
  },
  {
    Icon: Binary,
    label: "research",
    x: -RADIUS * Math.SQRT1_2,
    y: RADIUS * Math.SQRT1_2,
    angle: 135,
  },
];

export default function OrbitStage({
  complete,
  front,
  scale = 1,
  frozen = false,
  showLabels = false,
}: {
  complete: boolean;
  front: MotionValue<number>;
  scale?: number;
  frozen?: boolean;
  showLabels?: boolean;
}) {
  const markSize = 44 * scale;
  const iconSize = 18 * scale;
  const centerSize = 64 * scale;
  const lineLength = RADIUS * scale;
  const mask = useTransform(front, (p) => {
    if (p <= 0) return "none";
    const reach = Math.hypot(window.innerWidth, window.innerHeight) / 2;
    const outer = (p / SWEEP_RADIAL) * reach;
    const inner = Math.max(0, ((p - (1 - SWEEP_RADIAL)) / SWEEP_RADIAL) * reach);
    return `radial-gradient(circle at 50% 50%, transparent ${inner}px, #000 ${outer}px)`;
  });
  const haloShape = useMemo(
    () => ({
      lines: LOADER_MARKS.map(({ angle }) => ({ angle, length: lineLength })),
      frame: centerSize / 2,
      boxes: LOADER_MARKS.map(({ x, y }) => ({ x, y, half: markSize / 2 })),
    }),
    [lineLength, centerSize, markSize],
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      initial={frozen ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={frozen ? { duration: 0 } : { duration: 0.32, ease: "easeOut" }}
    >

      <motion.div
        initial={frozen ? false : undefined}
        animate={frozen ? { rotate: 0 } : { rotate: [0, 2.2, 0, -2.2, 0] }}
        transition={frozen ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative"
          initial={frozen ? false : { scale: 0.7, rotate: -30 }}
          animate={{ scale: complete ? 0.8 : 1, rotate: complete ? -140 : 0 }}
          transition={
            frozen
              ? { duration: 0 }
              : complete
                ? { duration: RELEASE_MS / 1000, ease: EASE_OUT }
                : { duration: 0.48, ease: EASE_OUT }
          }
        >
          <div
            className="absolute left-1/2 top-1/2 border border-accent"
            style={{
              width: centerSize,
              height: centerSize,
              translate: "-50% -50%",
              boxShadow: "0 0 0 1px rgb(var(--accent-rgb) / 0.18)",
            }}
          />

          {!frozen && <HalftoneHalo size={lineLength * 2 + 80} shape={haloShape} />}

          {LOADER_MARKS.map(({ angle }, index) => {
            const delayMs = (0.22 + index * 0.1) * 1000;
            const durationMs = 550;
            return (
              <motion.div
                key={`line-${angle}`}
                className="absolute left-1/2 top-1/2 h-px origin-left bg-white/[0.22]"
                style={{ width: lineLength, rotate: `${angle}deg` }}
                initial={frozen ? false : { scaleX: 0, opacity: 0 }}
                animate={
                  frozen
                    ? { scaleX: 1, opacity: 1 }
                    : {
                        scaleX: 1,
                        opacity: 1,
                      }
                }
                transition={
                  frozen
                    ? { duration: 0 }
                    : {
                        duration: durationMs / 1000,
                        delay: delayMs / 1000,
                        ease: EASE_OUT,
                      }
                }
              />
            );
          })}

          {LOADER_MARKS.map(({ Icon, label, x, y }, index) => {
              const delayMs = (0.2 + index * 0.1) * 1000;
              const durationMs = 620;
              return (
                <motion.div
                  key={label}
                  data-material
                  className="glass-tile absolute left-1/2 top-1/2 flex items-center justify-center text-fg"
                  style={{
                    width: markSize,
                    height: markSize,
                    translate: "-50% -50%",
                  }}
                  initial={frozen ? false : { opacity: 0, x: 0, y: 0, scale: 0.7 }}
                  animate={
                    frozen
                      ? { opacity: 1, x: x * scale, y: y * scale, scale: 1 }
                      : {
                          opacity: 1,
                          x,
                          y,
                          scale: 1,
                        }
                  }
                  transition={
                    frozen
                      ? { duration: 0 }
                      : {
                          duration: durationMs / 1000,
                          delay: delayMs / 1000,
                          ease: EASE_OUT,
                        }
                  }
                >
                  <Icon size={iconSize} strokeWidth={1.65} aria-label={label} />
                  {showLabels && (
                    <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim">
                      {label}
                    </span>
                  )}
                </motion.div>
              );
            })}

          <span
            className="absolute left-1/2 top-1/2 block rotate-45 bg-accent"
            style={{
              width: centerSize * 0.16,
              height: centerSize * 0.16,
              translate: "-50% -50%",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
