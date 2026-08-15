"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_MS = 40;
const FRAME_COUNT = 12;

const SCRAMBLE_CHARS = "0123456789#%&*+=~<>/|";

export function useScrambleText(
  text: string,
  active: boolean,
  options?: { repeatable?: boolean; skip?: boolean },
): string {
  const repeatable = options?.repeatable ?? false;
  const skip = options?.skip ?? false;
  const [display, setDisplay] = useState(skip || active ? text : "");

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
