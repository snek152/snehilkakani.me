"use client";

import { motion, useReducedMotion } from "motion/react";
import { useNavDirection } from "@/app/lib/components/AppShell";

/**
 * Directional exposure transition. A route is revealed from the edge in the
 * direction of travel, preserving spatial context without a decorative
 * viewport overlay on every navigation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const direction = useNavDirection();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  const forward = direction >= 0;

  return (
    <motion.div
      initial={
        direction === 0
          ? false
          : {
              clipPath: `inset(0 ${forward ? "100%" : "0"} 0 ${
                forward ? "0" : "100%"
              })`,
            }
      }
      animate={{ clipPath: "inset(0 0% 0 0%)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
