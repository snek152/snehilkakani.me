"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const FRAME_MS = 40;
const FRAME_COUNT = 12;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*";

/**
 * One-shot companion to `RoleCycle`'s scramble-decode: shares the same
 * cadence (40ms frames, 12-frame resolve window) but decodes exactly once,
 * triggered by `active` flipping true instead of an interval. Used to make
 * the Experience heading feel like it's assembling out of the marquee
 * ticker's motion — the ticker decelerates at the same moment this decodes,
 * so the reader's attention transfers from one to the other rather than the
 * heading just appearing.
 */
export default function ManifestoHeading({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion || active ? text : "");
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion || !active || startedRef.current) return;
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
  }, [active, reduceMotion, text]);

  return (
    <h2 id="experience-heading" aria-label={text} className={className}>
      {display || "\u00A0"}
    </h2>
  );
}
