"use client";

import { useEffect, useState } from "react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

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

/**
 * Rotating role title above the hero name, cycling on `HOLD_MS` and
 * scramble-decoding into each new role via the shared `useScrambleText` — the
 * same decode the section headings and the loader use, so the motif reads as
 * one idea rather than three implementations of it.
 *
 * This file used to carry its own verbatim copy of that algorithm: identical
 * frame cadence, resolve window, glyph set, and per-character shuffle, drifting
 * independently of the hook. A site whose durations all derive from one tempo
 * grid and whose type sizes all derive from one scale should not have had two
 * decoders.
 *
 * Deliberately unhurried — a long hold per role, so it reads as a considered
 * detail rather than a twitchy effect.
 */
export default function RoleCycle() {
  const reduceMotion = useMotionPreference();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % ROLES.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const display = useScrambleText(ROLES[index], true, { skip: reduceMotion });

  const textClass =
    "m-0 font-display text-[length:var(--size-display-sm)] font-semibold tracking-[var(--track-display-sm)] text-accent-text tabular-nums";

  if (reduceMotion) {
    return <p className={textClass}>{ROLES[0]}</p>;
  }

  return (
    <div className="relative h-[1.6em] overflow-hidden">
      {/* The settled role for assistive tech, the churning glyphs hidden from
        * it — the same split `ManifestoHeading` uses. This used to be a single
        * `aria-live="off"` node holding `display`, which stops the churn being
        * ANNOUNCED but still leaves mid-decode glyphs as the text a screen
        * reader finds when it reaches the line. The role is the one word here
        * worth reading; it should never be `7#4%` to anyone. */}
      <p className={textClass}>
        <span className="sr-only">{ROLES[index]}</span>
        <span aria-hidden="true">{display}</span>
      </p>
    </div>
  );
}
