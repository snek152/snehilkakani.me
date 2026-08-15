import type { Variants } from "motion/react";
import { beats } from "./tempo";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.982, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: beats(0.75), ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: beats(0.1) },
  },
};

export const SPRING_UI = { type: "spring", bounce: 0, duration: 0.4 } as const;

export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
