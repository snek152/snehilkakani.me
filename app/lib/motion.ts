import type { Variants } from "motion/react";

/** Primary entrance easing — snappy deceleration. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Curtains / big choreographed moves. */
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

/** Shared fade + rise entrance, used for page-level transitions. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
};

/** Stagger container for lists of entrance-animated children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};
