"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { GRID_STOPS } from "@/app/lib/grid";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

/**
 * The structural grid arriving.
 *
 * Home's hero retracts these same four lines upward as it scrolls away,
 * and each one lands as a tick in the rule beneath it. Here they come the
 * other way: drawing downward, staggered, as the page opens. Same lines,
 * same positions, opposite direction — so moving from the home page to
 * this one reads as one continuous gesture rather than two unrelated
 * intros.
 *
 * Sits behind a page header; the parent must be `relative` and full
 * bleed, since the stops are percentages of the page's whole width.
 */
export default function GridArrival() {
  const reduceMotion = useMotionPreference();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {GRID_STOPS.map((stop, index) => (
        <motion.div
          key={stop}
          className="absolute inset-y-0 w-px bg-dim2/15"
          style={{
            left: `${stop}%`,
            transformOrigin: "top",
            marginLeft: stop === 100 ? "-1px" : undefined,
          }}
          initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : beats(1.6),
            ease: EASE_OUT,
            delay: reduceMotion ? 0 : index * beats(0.14),
          }}
        />
      ))}
    </div>
  );
}
