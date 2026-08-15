"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

const DRAW_LEAD = 240;

export default function DrawnRule({
  className = "",
  ruleClassName = "",
  delay = 0,
  origin = "left",
}: {
  className?: string;

  ruleClassName?: string;

  delay?: number;
  origin?: "left" | "right";
}) {
  const reduceMotion = useMotionPreference();
  const ref = useRef<HTMLSpanElement>(null);

  const [stranded, setStranded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const fromDocumentTop = el.getBoundingClientRect().top + window.scrollY;
      setStranded(
        document.documentElement.scrollHeight - fromDocumentTop < DRAW_LEAD,
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const present = reduceMotion || stranded;

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={`block h-px w-full bg-rule ${ruleClassName} ${className}`}
      style={{ transformOrigin: origin }}
      initial={present ? false : { scaleX: 0 }}
      animate={present ? { scaleX: 1 } : undefined}
      whileInView={present ? undefined : { scaleX: 1 }}
      viewport={{ once: true, margin: `100000px 0px -${DRAW_LEAD}px 0px` }}
      transition={
        present
          ? { duration: 0 }
          : { duration: beats(1.25), ease: EASE_OUT, delay }
      }
    />
  );
}
