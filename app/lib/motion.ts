import type { Variants } from "motion/react";
import { beats } from "./tempo";

/** Primary entrance easing — snappy deceleration. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Curtains / big choreographed moves. */
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

/** Shared fade + rise entrance, used for page-level transitions. Duration
 * comes off the tempo grid so every page header lands on the same beat as
 * the rest of the site's motion, rather than a bare number picked in
 * isolation. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: beats(0.75), ease: EASE_OUT },
  },
};

/** Stagger container for lists of entrance-animated children. Interval
 * derives from the tempo grid, same as every other reveal timing. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: beats(0.1) },
  },
};
