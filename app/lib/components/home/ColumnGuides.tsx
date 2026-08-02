"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GRID_STOPS } from "@/app/lib/grid";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

/**
 * The page grid, continued down the Experience list.
 *
 * Hero draws these four lines and hands them to the index band, where
 * they become its dividers. Below that the grid was gone, even though the
 * list underneath is laid out on exactly the same quarters.
 *
 * These carry it on — but deliberately *not* as one unbroken run from the
 * band above. They belong to this section: they start empty and draw
 * downward as the reader moves through it, so the grid reads as being
 * extended by the reading rather than as a frame that was always there.
 * Held far fainter than Hero's, since here they sit behind body text
 * rather than an empty stage.
 *
 * The parent must be `relative` and full bleed for the stops to land on
 * true page quarters.
 */
export default function ColumnGuides() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Begins once the section's top has risen into the viewport and
    // completes well before its end, so the lines are fully drawn while
    // there is still list left to read rather than finishing as it goes.
    offset: ["start 85%", "end 60%"],
  });

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Interior stops only. The 100% stop is the page's own edge — as a
        * short divider in the index band that reads as structure, but run
        * the full height of a long section it reads as a frame around the
        * page. */}
      {GRID_STOPS.filter((stop) => stop < 100).map((stop, index) => (
        <Guide
          key={stop}
          progress={scrollYProgress}
          stop={stop}
          index={index}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

function Guide({
  progress,
  stop,
  index,
  reduceMotion,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  stop: number;
  index: number;
  reduceMotion: boolean;
}) {
  // Staggered left to right, the same order the band's dividers land in.
  const start = index * 0.06;
  const scaleY = useTransform(
    progress,
    [start, start + 0.5],
    reduceMotion ? [1, 1] : [0, 1],
  );

  return (
    <motion.span
      className="absolute inset-y-0 w-px origin-top bg-dim2/10"
      style={{
        left: `${stop}%`,
        marginLeft: stop === 100 ? "-1px" : undefined,
        scaleY,
      }}
    />
  );
}
