"use client";

import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useEffect, useRef, useState } from "react";

// Order is load-bearing: index 0 is what reduced-motion users see
// permanently (`ROLES[0]` below) and what a recruiter screening for a
// software candidate reads first, so an engineering role must lead. The
// remaining engineering/non-engineering roles are interleaved so no two
// non-engineering roles sit adjacent — do not resort this alphabetically
// or by "variety".
const ROLES = [
  "Software Engineer",
  "Photographer",
  "AI Engineer",
  "Music Producer",
  "Full-Stack Developer",
  "Audio Engineer",
];

const HOLD_MS = 4000;
const FRAME_MS = 40;
const FRAME_COUNT = 12;

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*";

/**
 * Rotating role title above the hero name. Each role change scramble-decodes
 * into place: characters flicker through random glyphs and settle into the
 * target word in a shuffled (non-linear) order, evoking a deliberate
 * "decrypt" rather than a mechanical typewriter sweep. Deliberately
 * unhurried — a long hold per role and a slow per-frame cadence so it reads
 * as a considered detail, not a twitchy effect.
 */
export default function RoleCycle() {
  const reduceMotion = useMotionPreference();
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
      .map((char) =>
        char === " " ? 0 : 1 + Math.floor(Math.random() * FRAME_COUNT),
      );
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
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
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

  const textClass =
    "m-0 font-display text-[length:var(--size-display-sm)] font-semibold tracking-[var(--track-display-sm)] text-accent-text tabular-nums";

  if (reduceMotion) {
    return <p className={textClass}>{ROLES[0]}</p>;
  }

  return (
    <div className="relative h-[1.6em] overflow-hidden">
      <p aria-live="off" className={textClass}>
        {display}
      </p>
    </div>
  );
}
