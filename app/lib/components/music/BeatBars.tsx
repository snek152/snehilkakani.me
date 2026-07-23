"use client";

import { motion, useReducedMotion } from "motion/react";

const HEIGHTS = [0.4, 0.85, 0.55, 1, 0.65];

/**
 * Five-bar equalizer glyph swapped in for the play icon on the active,
 * playing row. Animates in tempo-locked cycles; renders static (final
 * frame) under reduced motion so nothing loops indefinitely.
 */
export default function BeatBars({ tempo }: { tempo: number }) {
  const prefersReducedMotion = useReducedMotion();
  const dur = 60 / tempo;

  return (
    <div className="flex h-4 items-end gap-[2px]" aria-hidden="true">
      {HEIGHTS.map((h, i) =>
        prefersReducedMotion ? (
          <span
            key={i}
            className="w-[2.5px] rounded-[1px] bg-accent"
            style={{ height: 14, transform: `scaleY(${h})`, transformOrigin: "bottom" }}
          />
        ) : (
          <motion.span
            key={i}
            className="w-[2.5px] rounded-[1px] bg-accent"
            style={{ height: 14, transformOrigin: "bottom" }}
            initial={{ scaleY: h }}
            animate={{ scaleY: [h, 1, h * 0.55, 1, h] }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay: i * (dur / 6),
              ease: "easeInOut",
            }}
          />
        ),
      )}
    </div>
  );
}
