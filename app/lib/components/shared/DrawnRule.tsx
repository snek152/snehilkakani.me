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
      // as seen, so a skipped rule is simply present.
      viewport={{ once: true, margin: "100000px 0px -10% 0px" }}
      transition={{ duration: reduceMotion ? 0 : beats(1.1), ease: EASE_OUT, delay }}
    />
  );
}

/** The rule's resting colour — the same value as the `border` token. */
const RULE_DIM = "rgba(255, 255, 255, 0.07)";
/** What it's struck at, before settling back. */
const RULE_BRIGHT = "rgba(255, 255, 255, 0.30)";

/**
 * A rule that is struck rather than merely drawn.
 *
 * Same expansion as `DrawnRule`, but the line itself carries the
 * brightness: it comes in at several times its resting strength and dims
 * back down once it has reached full width. So it expands out, then goes
 * bright to dim — one line doing both, rather than a separate coloured
 * segment travelling along a line that was already there.
 *
 * An earlier version used an accent-coloured leading edge. It read as a
 * blue thing sliding across rather than as the rule arriving, which is a
 * different — and busier — idea than the one the rest of the page is
 * built on.
 *
 * Kept to the Experience list deliberately. On the projects page the
 * rules sit directly above photographs that are already doing the
 * arriving, and two arrivals at once is one too many.
 */
export function StruckRule({ className = "" }: { className?: string }) {
  const reduceMotion = useMotionPreference();

  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px w-full ${className}`}
      style={{ transformOrigin: "left", backgroundColor: RULE_DIM }}
      initial={reduceMotion ? false : { scaleX: 0, backgroundColor: RULE_BRIGHT }}
      whileInView={
        reduceMotion ? undefined : { scaleX: 1, backgroundColor: [RULE_BRIGHT, RULE_BRIGHT, RULE_DIM] }
      }
      // Same skipped-rule guard as `DrawnRule` (see there), with the
      // lower edge held short of the fold so the strike plays where the
      // reader can actually watch it rather than just below the screen.
      viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
      transition={{
        scaleX: { duration: beats(1.1), ease: EASE_OUT },
        // Holds full brightness for the width of the expansion, then
        // settles over the same curve.
        backgroundColor: { duration: beats(2), ease: EASE_OUT, times: [0, 0.55, 1] },
      }}
    />
  );
}
