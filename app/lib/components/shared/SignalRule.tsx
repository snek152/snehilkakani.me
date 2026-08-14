"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "./MotionPreference";

/**
 * A header-scale rule: a quiet structural border carrying the same restrained
 * blue cast as the persistent transport. It is intentionally distinct from
 * DrawnRule, which introduces content rows as the reader reaches them.
 */
export default function SignalRule({
  draw = true,
  delay = 0,
  emphasis = "quiet",
  endpoint = false,
  className = "",
}: {
  draw?: boolean;
  delay?: number;
  emphasis?: "quiet" | "strong";
  endpoint?: boolean;
  className?: string;
}) {
  const reduceMotion = useMotionPreference();
  const present = reduceMotion || !draw;
  const bloom = emphasis === "strong" ? "0.26" : "0.14";

  return (
    <span aria-hidden="true" className={`block h-px overflow-visible ${className}`}>
      <motion.span
        className="absolute inset-0 origin-left bg-border"
        style={{ boxShadow: `0 6px 14px -7px rgb(var(--accent-rgb) / ${bloom})` }}
        initial={present ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={present ? { duration: 0 } : { duration: beats(0.9), delay, ease: EASE_OUT }}
      />
      {endpoint && (
        <motion.span
          className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent"
          initial={present ? false : { opacity: 0, transform: "translateY(-50%) scale(0.65)" }}
          animate={{ opacity: 1, transform: "translateY(-50%) scale(1)" }}
          transition={present ? { duration: 0 } : { duration: beats(0.32), delay: delay + beats(0.86), ease: EASE_OUT }}
        />
      )}
    </span>
  );
}
