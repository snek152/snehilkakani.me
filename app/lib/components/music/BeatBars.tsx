"use client";

import { motion, type MotionValue } from "motion/react";

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
