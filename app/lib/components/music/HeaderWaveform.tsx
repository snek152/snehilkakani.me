"use client";

import { motion, useReducedMotion } from "motion/react";

/** Fixed bar heights (0–1) forming a static waveform silhouette next to the title. */
const HEIGHTS = [
  0.3, 0.55, 0.4, 0.75, 0.5, 0.95, 0.6, 0.35, 0.7, 0.45, 0.85, 0.3, 0.5, 0.65,
  0.4,
];

/**
 * Ambient waveform strip beside the "Music" heading — the route's one
 * signature detail, standing in for the camera-corner motif used elsewhere.
 * Idles as a static silhouette; when a track is playing it breathes gently
 * at that track's tempo. Respects reduced motion.
 */
export default function HeaderWaveform({
  tempo,
  playing,
}: {
  tempo?: number;
  playing?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const animate = playing && tempo && !prefersReducedMotion;
  const dur = tempo ? 60 / tempo : 1;

  return (
    <div
      className="flex h-9 items-end gap-[3px] sm:h-11"
      aria-hidden="true"
    >
      {HEIGHTS.map((h, i) =>
        animate ? (
          <motion.span
            key={i}
            className="w-[3px] rounded-[1px] bg-accent"
            style={{ transformOrigin: "bottom" }}
            initial={{ height: `${h * 100}%`, opacity: 0.55 }}
            animate={{
              height: [`${h * 100}%`, "100%", `${h * 55}%`, `${h * 100}%`],
              opacity: [0.55, 0.9, 0.5, 0.55],
            }}
            transition={{
              duration: dur * 2,
              repeat: Infinity,
              delay: i * (dur / 8),
              ease: "easeInOut",
            }}
          />
        ) : (
          <span
            key={i}
            className="w-[3px] rounded-[1px] bg-accent/40"
            style={{ height: `${h * 100}%` }}
          />
        ),
      )}
    </div>
  );
}
