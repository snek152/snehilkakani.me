"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_MS = 40;
const FRAME_COUNT = 12;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*";

/**
 * Scramble-decodes `text` into place the instant `active` flips true —
 * characters flicker through random glyphs and settle in a shuffled
 * (non-linear) order per character, evoking a deliberate "decrypt" rather
 * than a mechanical typewriter sweep. Shares cadence with `RoleCycle`'s
 * interval-driven cycle (40ms frames, 12-frame resolve window) but decodes
 * exactly once per `active` flip rather than looping.
 *
 * `repeatable` lets it re-decode every time `active` re-flips true (e.g. a
 * hover in/out/in) instead of resolving once and staying locked. `skip`
 * (reduced motion) bypasses the animation and returns `text` immediately.
 */
export function useScrambleText(
  text: string,
  active: boolean,
  options?: { repeatable?: boolean; skip?: boolean },
): string {
  const repeatable = options?.repeatable ?? false;
  const skip = options?.skip ?? false;
  const [display, setDisplay] = useState(skip || active ? text : "");
  const startedRef = useRef(false);

  useEffect(() => {
    if (skip) {
      setDisplay(text);
      return;
    }
    if (!active) {
      if (repeatable) startedRef.current = false;
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    const resolveFrames = text
      .split("")
      .map((char) => (char === " " ? 0 : 1 + Math.floor(Math.random() * FRAME_COUNT)));
    let frame = 0;

    const id = setInterval(() => {
      frame += 1;
      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame >= resolveFrames[i]) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      setDisplay(next);

      if (frame >= FRAME_COUNT) {
        setDisplay(text);
        clearInterval(id);
      }
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [active, text, repeatable, skip]);

  return display;
}
