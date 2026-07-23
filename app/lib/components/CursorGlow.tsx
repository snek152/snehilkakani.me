"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Fixed radial glow that follows the cursor — a soft ambient light source.
 * Disabled entirely under reduced motion or on coarse/touch pointers, where
 * a hover-following glow has no meaning and only costs paint.
 */
export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isCoarsePointer) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion, isCoarsePointer]);

  if (prefersReducedMotion || isCoarsePointer) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(540px circle at ${pos.x}px ${pos.y}px, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.045) 40%, transparent 70%)`,
        transition: "background 0.08s ease",
      }}
    />
  );
}
