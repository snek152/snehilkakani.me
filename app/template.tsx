"use client";

import { motion, useReducedMotion } from "motion/react";
import { useNavDirection } from "@/app/lib/components/AppShell";

/**
 * Per-navigation page-enter transition. Next.js remounts `template.tsx`
 * (and therefore this animation) on every route change, between layout
 * and the page itself.
 *
 * Direction-aware: content slides in from the side matching the direction
 * of travel through the sidebar nav order (forward = enters from the
 * right, backward = from the left), paired with a brief, subtle echo of
 * the viewfinder corner-bracket motif (see ViewfinderFrame) that flashes
 * in on the full viewport and fades out as the new page settles — a
 * quick "focus confirm" beat, not a repeated gimmick, so it's gated to
 * real route changes (direction !== 0) and skipped on initial load.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const direction = useNavDirection();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  const offsetX = direction * 24;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: offsetX }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.6 }}
      >
        {children}
      </motion.div>

      {direction !== 0 && (
        <div className="pointer-events-none fixed inset-0 z-[80]">
          {(
            [
              { top: 0, left: 0, rotate: 0 },
              { top: 0, right: 0, rotate: 90 },
              { bottom: 0, right: 0, rotate: 180 },
              { bottom: 0, left: 0, rotate: 270 },
            ] as const
          ).map((pos, i) => (
            <motion.svg
              key={i}
              aria-hidden
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              className="absolute text-accent"
              style={{
                top: "top" in pos ? pos.top : undefined,
                bottom: "bottom" in pos ? pos.bottom : undefined,
                left: "left" in pos ? pos.left : undefined,
                right: "right" in pos ? pos.right : undefined,
                transform: `rotate(${pos.rotate}deg)`,
              }}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <path d="M0 0H14" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 0V14" stroke="currentColor" strokeWidth="1.5" />
            </motion.svg>
          ))}
        </div>
      )}
    </>
  );
}
