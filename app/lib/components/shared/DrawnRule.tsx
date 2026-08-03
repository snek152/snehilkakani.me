"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

/**
 * A hairline that draws itself across as it enters view.
 *
 * The site is built almost entirely out of 1px rules — they separate every
 * role, every project, every section. They were all simply *there* on
 * load. Having each one draw as the reader reaches it turns the page's
 * own structure into the animation, which is the same idea as Hero's
 * retracting grid lines: motion that is the layout moving, not an effect
 * laid over it.
 *
 * Deliberately not a fade. A rule that fades in reads as a fade; a rule
 * that draws reads as being *ruled*, like a line struck across a page.
 */
export default function DrawnRule({
  className = "",
  delay = 0,
  origin = "left",
}: {
  className?: string;
  /** Seconds. Use `beats()` at the call site to stay on the timing grid. */
  delay?: number;
  origin?: "left" | "right";
}) {
  const reduceMotion = useMotionPreference();

  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px w-full bg-border ${className}`}
      style={{ transformOrigin: origin }}
      initial={reduceMotion ? false : { scaleX: 0 }}
      whileInView={reduceMotion ? undefined : { scaleX: 1 }}
      // The enormous top margin is load-bearing, not a fudge. A plain
      // `whileInView` only fires for elements the viewport actually
      // meets, so any rule the reader skips past — dragging the
      // scrollbar, pressing End, reloading at a restored position —
      // never fires and stays at `scaleX: 0`. On a decorative flourish
      // that's invisible; on the rules that separate every row it means
      // the page arrives with its lines missing. Extending the observer
      // root far above the viewport makes "already scrolled past" count
      // as seen, so a skipped rule is simply present. The lower edge is
      // held short of the fold so the draw plays where the reader can
      // watch it: firing as the row clears the bottom of the screen
      // sounds like it shows more and shows less, since the rule is
      // still below the viewport for the whole animation.
      viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
      transition={{ duration: reduceMotion ? 0 : beats(1.1), ease: EASE_OUT, delay }}
    />
  );
}
