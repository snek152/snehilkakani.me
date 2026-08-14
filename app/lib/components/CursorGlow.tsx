"use client";

import { motion, useMotionTemplate } from "motion/react";
import { useCursorField } from "@/app/lib/components/shared/CursorField";

/**
 * Fixed radial glow that follows the cursor — a soft ambient light
 * source. Reads position from the shared `CursorField` rather than its
 * own `mousemove` listener, so this and any proximity-reactive element
 * elsewhere on the page (`useProximity`) are responding to the exact
 * same cursor, not two independently-tracked copies of it.
 */
export default function CursorGlow() {
  const { x, y, active } = useCursorField();
  const background = useMotionTemplate`radial-gradient(540px circle at ${x}px ${y}px, rgb(var(--accent-rgb) / 0.12) 0%, rgb(var(--accent-rgb) / 0.045) 40%, transparent 70%)`;

  if (!active) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}
