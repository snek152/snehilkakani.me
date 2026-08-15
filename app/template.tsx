"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useNavDirection } from "@/app/lib/components/AppShell";

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

      transition={{ duration: beats(0.65), ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
