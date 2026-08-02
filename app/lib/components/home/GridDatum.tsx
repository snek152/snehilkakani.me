"use client";

import { motion, type MotionValue, useTransform } from "motion/react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { GRID_LANDINGS, GRID_STOPS } from "@/app/lib/grid";

/** How much scroll a tick takes to drop into place before its landing. */
const FALL = 0.14;

/**
 * The rule between Hero and Experience.
 *
 * What was here before was a status band: a location and a live clock set
 * in small monospace. It read as filler — the two most over-used tokens
 * of a generated portfolio, in the one spot on the page that had no job.
 *
 * This does a job. Hero draws four vertical lines across the viewport and
 * retracts them as it scrolls away; until now they simply vanished. Each
 * one now *lands* — as a line finishes collapsing, a tick drops into this
 * rule at exactly its horizontal position, flaring to accent on impact
 * and settling to a hairline. The page's structure hands off downward
 * instead of evaporating, and the reader gets a moment of motion that is
 * doing something rather than decorating.
 *
 * No text, deliberately. It's a datum line, not a caption.
 */
export default function GridDatum({ progress }: { progress: MotionValue<number> }) {
  const reduceMotion = useMotionPreference();
  // The rule itself draws in across the first stretch of the handoff, so
  // there's something for the ticks to land on by the time they arrive.
  const ruleScale = useTransform(progress, [0.12, 0.6], reduceMotion ? [1, 1] : [0, 1]);

  return (
    <div aria-hidden className="relative -mx-6 h-14 sm:-mx-8 lg:-mx-12">
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-border"
        style={{ scaleX: reduceMotion ? 1 : ruleScale }}
      />
      {GRID_LANDINGS.map((landing, index) => (
        <Tick
          key={landing}
          progress={progress}
          landing={landing}
          left={`${GRID_STOPS[index]}%`}
          // Hero's lines sit flush at each 25% position. Only the last
          // one, at 100%, would render its single pixel past the right
          // edge, so it alone is pulled back inside.
          inset={GRID_STOPS[index] === 100}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

function Tick({
  progress,
  landing,
  left,
  inset,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  landing: number;
  left: string;
  inset: boolean;
  reduceMotion: boolean;
}) {
  // The tick drops from the top of the band onto the rule. Scale alone
  // carries the landing: an opacity ramp alongside it spanned ~17px of
  // scroll, which is imperceptible as a fade and behaved unpredictably
  // at that width.
  const scaleY = useTransform(progress, [landing - FALL, landing], reduceMotion ? [1, 1] : [0, 1]);
  // Flares to accent on impact, then settles back to a hairline.
  const flare = useTransform(
    progress,
    [landing - FALL, landing, landing + 0.1],
    reduceMotion ? [0, 0, 0] : [0, 1, 0],
  );

  const marginLeft = inset ? "-1px" : "0px";

  return (
    <>
      <motion.div
        className="absolute bottom-0 w-px origin-bottom bg-dim2/25"
        style={{ left, height: "1.25rem", scaleY, marginLeft }}
      />
      <motion.div
        className="absolute bottom-0 w-px origin-bottom bg-accent"
        style={{ left, height: "1.25rem", scaleY, opacity: flare, marginLeft }}
      />
    </>
  );
}
