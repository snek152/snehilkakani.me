"use client";

import { Aperture, Binary, SlidersVertical, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

const RADIUS = 140;
export const RELEASE_MS = 1000;

const ORBIT_MARKS = [
  {
    Icon: Terminal,
    label: "engineering",
    x: -RADIUS * Math.SQRT1_2,
    y: -RADIUS * Math.SQRT1_2,
    angle: -135,
    release: { x: -160, y: 220 },
  },
  {
    Icon: SlidersVertical,
    label: "music",
    x: RADIUS * Math.SQRT1_2,
    y: -RADIUS * Math.SQRT1_2,
    angle: -45,
    release: { x: 40, y: -260 },
  },
  {
    Icon: Aperture,
    label: "photography",
    x: RADIUS * Math.SQRT1_2,
    y: RADIUS * Math.SQRT1_2,
    angle: 45,
    release: { x: 260, y: 200 },
  },
  {
    Icon: Binary,
    label: "research",
    x: -RADIUS * Math.SQRT1_2,
    y: RADIUS * Math.SQRT1_2,
    angle: 135,
    release: { x: -30, y: 280 },
  },
];

export default function OrbitStage({
  complete,
  scale = 1,
}: {
  complete: boolean;
  scale?: number;
}) {
  const markSize = 44 * scale;
  const iconSize = 18 * scale;
  const centerSize = 64 * scale;
  const lineLength = RADIUS * scale;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ opacity: complete ? [1, 1, 0] : 1 }}
      transition={{
        duration: complete ? RELEASE_MS / 1000 : 0.32,
        times: complete ? [0, 0.3, 1] : undefined,
      }}
    >

      <motion.div
        animate={{ rotate: [0, 2.2, 0, -2.2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.7, rotate: -30 }}
          animate={
            complete ? { scale: 0.06, rotate: -250 } : { scale: 1, rotate: 0 }
          }
          transition={{
            duration: complete ? RELEASE_MS / 1000 : 0.48,
            ease: EASE_OUT,
          }}
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

          {ORBIT_MARKS.map(({ angle }, index) => {
            const delayMs = complete ? index * 30 : (0.22 + index * 0.1) * 1000;
            const durationMs = complete ? RELEASE_MS - delayMs : 550;
            return (
              <motion.div
                key={`line-${angle}`}
                className="absolute left-1/2 top-1/2 h-px origin-left bg-white/[0.22]"
                style={{ width: lineLength, rotate: `${angle}deg` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: complete ? 2.4 : 1,
                  opacity: complete ? [1, 0.5, 0] : 1,
                }}
                transition={{
                  duration: durationMs / 1000,
                  delay: delayMs / 1000,
                  ease: EASE_OUT,
                }}
              />
            );
          })}

          {ORBIT_MARKS.map(({ Icon, label, x, y, release }, index) => {
            const delayMs = complete ? index * 50 : (0.2 + index * 0.1) * 1000;
            const durationMs = complete ? RELEASE_MS - delayMs : 620;
            return (
              <motion.div
                key={label}
                className="absolute left-1/2 top-1/2 flex items-center justify-center border border-white/[0.22] bg-white/[0.03] text-fg"
                style={{
                  width: markSize,
                  height: markSize,
                  translate: "-50% -50%",
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
                animate={{
                  opacity: complete ? [1, 1, 0] : 1,
                  x: complete ? release.x : x,
                  y: complete ? release.y : y,
                  scale: complete ? [1, 0.6, 0] : 1,
                }}
                transition={{
                  duration: durationMs / 1000,
                  delay: delayMs / 1000,
                  times: complete ? [0, 0.55, 1] : undefined,
                  ease: EASE_OUT,
                }}
              >
                <Icon size={iconSize} strokeWidth={1.65} aria-label={label} />
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
