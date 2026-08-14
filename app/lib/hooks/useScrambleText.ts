"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_MS = 40;
const FRAME_COUNT = 12;

/**
 * Deliberately NO letters.
 *
 * This set used to be `A-Z0-9#%&*`, which is 65% alphabetic — so a word
 * mid-decode did not read as a word being assembled, it read as the SAME word
 * misspelled. Caught in the wild on the hero: `Full-Stack Developer` rendering
 * as "Full-Stack Develoler", and the Experience heading as "V488rMC56L". On a
 * page whose whole job is to be credible to a recruiter, a job title that
 * appears to have a typo in it every four seconds is the most expensive
 * possible cost for a decorative effect.
 *
 * Digits and symbols cannot spell anything, so an intermediate frame is
 * unambiguously "not resolved yet". Digits also carry the tabular-figure
 * advance of the sans, which keeps the string's width from jittering as the
 * characters churn.
 */
const SCRAMBLE_CHARS = "0123456789#%&*+=~<>/|";

/**
 * The site's one decode: scramble-resolves `text` into place, each character
 * settling at its own random frame so positions land in a shuffled order
 * rather than a mechanical left-to-right sweep. 40ms frames, 12-frame resolve
 * window, glyphs from `SCRAMBLE_CHARS` above.
 *
 * Two call shapes, one rule — a new target decodes, the same target never
 * re-decodes:
 * - **One-shot reveal:** static `text`, `active` flipping true when the
 *   element reaches the reader (`ManifestoHeading`).
 * - **Cycling label:** `active` held true while `text` swaps on an interval
 *   (`RoleCycle`). Mounting does not scramble the first value.
 *
 * `repeatable` re-arms on `active` falling false, so an in/out/in (a hover)
 * decodes again instead of staying locked. `skip` (reduced motion) returns
 * `text` immediately and never starts an interval.
 */
export function useScrambleText(
  text: string,
  active: boolean,
  options?: { repeatable?: boolean; skip?: boolean },
): string {
  const repeatable = options?.repeatable ?? false;
  const skip = options?.skip ?? false;
  const [display, setDisplay] = useState(skip || active ? text : "");

  /* Keyed to the TEXT already decoded, not a bare "has started" flag.
   *
   * A bare boolean meant a caller that holds `active` true and swaps `text`
   * (a cycling label rather than a one-shot reveal) got its first decode and
   * then silently kept displaying the stale string forever. Comparing against
   * the text itself makes both callers fall out of one rule: a new target
   * decodes, the same target never re-decodes.
   *
   * Seeded with the text when it is already showing, so a caller that mounts
   * `active` does NOT scramble what it just painted — that reads as the word
   * corrupting rather than arriving. */
  const decodedRef = useRef<string | null>(skip || active ? text : null);

  useEffect(() => {
    if (skip) {
      setDisplay(text);
      return;
    }
    if (!active) {
      if (repeatable) decodedRef.current = null;
      return;
    }
    if (decodedRef.current === text) return;
    decodedRef.current = text;

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
