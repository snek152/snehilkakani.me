"use client";

import { motion, type MotionValue } from "motion/react";

/**
 * Five-bar equalizer glyph swapped in for the play icon on the active,
 * playing row. Driven by real Web Audio frequency data (see
 * `useAudioAnalyser`) — each bar's height is an actual frequency-band
 * level from the track currently playing, not a decorative tempo-locked
 * loop with no relationship to the audio.
 */
export default function BeatBars({ bars }: { bars: MotionValue<number>[] }) {
  return (
    <div className="flex h-4 items-end gap-[2px]" aria-hidden="true">
      {bars.map((bar, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-[1px] bg-accent"
          style={{ height: 14, scaleY: bar, transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}
