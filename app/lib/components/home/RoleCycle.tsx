"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ROLES = ["Software Engineer", "Music Producer", "Photographer"];

const HOLD_MS = 4000;
const FRAME_MS = 40;
const FRAME_COUNT = 12;

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*";

/**
 * Rotating role title under the hero name. Each role change scramble-decodes
 * into place: characters flicker through random glyphs and settle into the
 * target word in a shuffled (non-linear) order, evoking a deliberate
 * "decrypt" rather than a mechanical typewriter sweep. Deliberately
 * unhurried — a long hold per role and a slow per-frame cadence so it reads
 * as a considered detail, not a twitchy effect.
 */
export default function RoleCycle() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(ROLES[0]);
  const frameRef = useRef(0);
  const resolveFramesRef = useRef<number[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % ROLES.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const target = ROLES[index];

    // Each non-space character resolves at its own random frame, so
    // positions settle in a shuffled ("lock picking") order instead of a
    // rigid left-to-right sweep.
    resolveFramesRef.current = target
      .split("")
      .map((char) => (char === " " ? 0 : 1 + Math.floor(Math.random() * FRAME_COUNT)));
    frameRef.current = 0;

    const id = setInterval(() => {
      frameRef.current += 1;
      const frame = frameRef.current;
      const resolveFrames = resolveFramesRef.current;

      const next = target
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame >= resolveFrames[i]) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      setDisplay(next);

      if (frame >= FRAME_COUNT) {
        setDisplay(target);
        clearInterval(id);
      }
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [index, reduceMotion]);

  if (reduceMotion) {
    return (
      <p className="m-0 font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-accent sm:text-[1.3rem]">
        {ROLES[0]}
      </p>
    );
  }

  return (
    <div className="relative h-[1.6em] overflow-hidden">
      <p
        aria-live="off"
        className="m-0 font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-accent tabular-nums sm:text-[1.3rem]"
      >
        {display}
      </p>
    </div>
  );
}
