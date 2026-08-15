"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";

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
        className="absolute inset-x-0 top-0 h-full origin-top bg-accent/60 rounded-full shadow-[0_0_20px_2px_var(--color-accent)]"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}
