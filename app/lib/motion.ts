import type { Variants } from "motion/react";
import { beats } from "./tempo";

/** Primary entrance easing — snappy deceleration. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Curtains / big choreographed moves. */
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

/** Shared fade + rise entrance, used for page-level transitions. Mirrors
 * `Reveal`'s "fade-up" default (y: 20, duration: beats(0.75)) so every
 * page header lands on the same tempo-grid beat as the rest of the site's
 * motion, rather than a bare duration picked in isolation. */
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

/** Gentle ease-in-out (cubic) — a *slight* resistance near both
 * endpoints (roughly 6% visual progress at the 25% mark) with no
 * abrupt rush through the middle.
 *
 * This is a *value remap*, not an animation: it reshapes a continuous
 * scroll-derived number inside a `useTransform`, so the deck's cards
 * feel like they have friction as you scroll through them. Actual
 * animations use Motion's own easing (`EASE_OUT` above) via `animate`
 * — this exists because Motion's easing functions apply to time, and
 * what needs shaping here is scroll distance. */
export function easeInOutCubic(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c < 0.5 ? 4 * c ** 3 : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** Clamp to [0, 1]. */
export function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Linear interpolate, clamping `t` to [0, 1] first. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}
