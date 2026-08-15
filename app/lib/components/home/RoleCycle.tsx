"use client";

import { useEffect, useState } from "react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

const ROLES = [
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

  const fullRoleList = ROLES.join(", ");

  if (reduceMotion) {
    return (
      <p className={textClass}>
        <span aria-hidden="true">{ROLES[0]}</span>
        <span className="sr-only">{fullRoleList}</span>
      </p>
    );
  }

  return (
    <div className="relative h-[1.6em] overflow-hidden">
      <p className={textClass}>
        <span className="sr-only">{fullRoleList}</span>
        <span aria-hidden="true">{display}</span>
      </p>
    </div>
  );
}
