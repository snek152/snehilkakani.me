"use client";

import { useEffect, useState } from "react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

export const ROLES = [
  "Software Engineer",
  "Photographer",
  "AI Engineer",
  "Music Producer",
  "Full-Stack Developer",
  "Audio Engineer",
];

const HOLD_MS = 4000;

export default function RoleCycle() {
  const reduceMotion = useMotionPreference();
  const [index, setIndex] = useState(0);
  const display = useScrambleText(ROLES[index], true, {
    skip: reduceMotion,
  });

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % ROLES.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-px w-7 shrink-0 bg-accent" />
      <p className="m-0 font-display text-[length:var(--size-display-sm)] font-semibold tracking-[var(--track-display-sm)] text-fg">
        <span aria-hidden="true">{display}</span>
        <span className="sr-only">{ROLES.join(", ")}</span>
      </p>
    </div>
  );
}
