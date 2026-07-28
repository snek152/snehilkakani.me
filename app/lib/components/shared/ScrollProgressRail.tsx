"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";

/**
 * A thin fixed line at the far right edge of the viewport that fills
 * top-down as the page scrolls — quiet orientation, not a decoration.
 * Desktop only: on narrow viewports the margin it lives in disappears
 * and a second scroll cue would just compete with the content.
 */
export default function ScrollProgressRail() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-px bg-border lg:block"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-accent/60"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}
