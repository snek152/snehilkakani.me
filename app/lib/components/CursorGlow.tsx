"use client";

import { motion, useMotionTemplate } from "motion/react";
import { useCursorField } from "@/app/lib/components/shared/CursorField";

/**
 * Pointer-steered accent light. It is intentionally absent until a precise
 * pointer enters the experience: WaveField owns the site's continuous
 * background motion; this is local input feedback, not a second ambience.
 */
export default function CursorGlow() {
  const { x, y, active } = useCursorField();
  const background = useMotionTemplate`radial-gradient(540px circle at ${x}px ${y}px, rgb(var(--accent-rgb) / 0.12) 0%, rgb(var(--accent-rgb) / 0.045) 40%, transparent 70%)`;

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}
