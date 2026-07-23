"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

const TICKER =
  "SOFTWARE ENGINEERING · MUSIC PRODUCTION · AI RESEARCH · PHOTOGRAPHY · CAL POLY SLO · HIP-HOP PRODUCTION · FULL-STACK DEVELOPMENT · ";

// Base autoplay pace, in "%/second" of the track's -50% loop distance.
const BASE_SPEED = 50 / 38;

export default function Marquee() {
  const reduceMotion = useReducedMotion();
  const textClass =
    "shrink-0 text-[0.62rem] tracking-[0.14em] text-dim2 uppercase";

  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  });
  // Blend a small velocity-derived boost onto the base speed, symmetric for
  // scroll direction so fast scrolling either way accelerates the ticker.
  const speed = useTransform(
    smoothVelocity,
    (v) => BASE_SPEED + Math.min(Math.abs(v) * 0.015, BASE_SPEED * 6),
  );

  const x = useMotionValue(0);
  const lastTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (reduceMotion) return;
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const deltaSeconds = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    let next = x.get() - speed.get() * deltaSeconds;
    if (next <= -50) next += 50;
    x.set(next);
  });

  useEffect(() => {
    if (reduceMotion) return;
    lastTimeRef.current = null;
  }, [reduceMotion]);

  const xPercent = useTransform(x, (v) => `${v}%`);

  return (
    <div
      aria-hidden="true"
      className="-mx-6 overflow-hidden border-y border-border border-t-0 py-[0.48rem] sm:-mx-8 lg:-mx-12"
    >
      {reduceMotion ? (
        <div className={`w-max whitespace-nowrap ${textClass}`}>{TICKER}</div>
      ) : (
        <motion.div
          className="flex w-max whitespace-nowrap"
          style={{ x: xPercent }}
        >
          <span className={textClass}>{TICKER}</span>
          <span className={textClass}>{TICKER}</span>
        </motion.div>
      )}
    </div>
  );
}
