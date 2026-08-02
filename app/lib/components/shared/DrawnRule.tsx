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

/**
 * A `DrawnRule` struck with a bright leading edge.
 *
 * The plain rule draws, which reads as structure appearing. This adds the
 * thing that draws it: a short accent segment running the length of the
 * rule once and leaving, so the line looks *struck* rather than grown.
 * It's the same accent-on-arrival the index dividers flare with, which is
 * the point — the Experience list is the one part of the page with no
 * grid line of its own, so it borrows the gesture instead.
 *
 * Kept to the Experience list deliberately. On the projects page the
 * rules sit directly above photographs that are already doing the
 * arriving; a travelling accent there would be two things competing.
 */
export function StruckRule({ className = "" }: { className?: string }) {
  const reduceMotion = useMotionPreference();

  return (
    // Two elements on purpose. The outer one carries whatever positioning
    // the caller passed (`absolute inset-x-0 bottom-0`, typically); the
    // inner one owns `relative` so the rule and the spark have something
    // to sit against. Putting both on one element meant `relative` and
    // the caller's `absolute` landed in the same class list, where the
    // stylesheet's order decides the winner rather than the caller — and
    // when `relative` won, the rule stopped being out of flow and became
    // a grid item, shunting the row's columns sideways.
    <span aria-hidden="true" className={`block h-px w-full ${className}`}>
      <span className="relative block h-px w-full overflow-hidden">
        <DrawnRule className="absolute inset-x-0 top-0" />
        {!reduceMotion && (
          <motion.span
            className="absolute top-0 left-0 h-px w-[12%] bg-accent"
            initial={{ x: "-100%", opacity: 0 }}
            whileInView={{ x: ["-100%", "833%"], opacity: [0, 0.55, 0.55, 0] }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: beats(1.3), ease: EASE_OUT, times: [0, 0.15, 0.7, 1] }}
          />
        )}
      </span>
    </span>
  );
}
