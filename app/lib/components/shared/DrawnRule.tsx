"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

/**
 * How far above the fold a rule must rise before it starts drawing, in px.
 *
 * The draw takes about 0.8s, so if it starts as the rule crosses the
 * bottom edge it finishes in the last strip of the screen, where nobody is
 * looking — the animation is real, runs every time, and is never seen. At 240px
 * (roughly 73% of viewport height on a laptop) the line is struck where the
 * reader is actually reading.
 *
 * Two earlier values were both too low to watch: `-6%` (~54px) and, worse, a
 * POSITIVE `72px`, which started the draw below the fold so it was finished
 * before the rule ever appeared.
 */
const DRAW_LEAD = 240;

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
  ruleClassName = "",
  delay = 0,
  origin = "left",
}: {
  /** Layout classes — position, margin, width. */
  className?: string;
  /**
   * Classes for the 1px line ITSELF — anything that paints it, such as the
   * active track's `!bg-accent`. Separate from `className` so a state colour
   * and a position never fight over the same attribute.
   */
  ruleClassName?: string;
  /** Seconds. Use `beats()` at the call site to stay on the timing grid. */
  delay?: number;
  origin?: "left" | "right";
}) {
  const reduceMotion = useMotionPreference();
  const ref = useRef<HTMLSpanElement>(null);

  /* A rule within `DRAW_LEAD` of the end of the document can never rise that
   * far above the fold, because the fold stops at the document bottom — it
   * would sit at `scaleX: 0` forever. This was measured once already at -18%:
   * six permanently undrawn separators at the foot of /music. Those rules are
   * rendered simply present instead; they live in the last screenful where the
   * draw was never going to be watched anyway, and a missing line is a defect
   * while an un-animated one is not.
   *
   * Measured once on mount plus on resize, deliberately not with a
   * `ResizeObserver` per rule: that would put a page-wide observer behind every
   * divider on the page. Project and photo images are `next/image` with static
   * imports, so they reserve their aspect ratio and the document height does
   * not jump as they decode. */
  const [stranded, setStranded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const fromDocumentTop = el.getBoundingClientRect().top + window.scrollY;
      setStranded(document.documentElement.scrollHeight - fromDocumentTop < DRAW_LEAD);
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
      // The enormous top margin is load-bearing, not a fudge. A plain
      // `whileInView` only fires for elements the viewport actually
      // meets, so any rule the reader skips past — dragging the
      // scrollbar, pressing End, reloading at a restored position —
      // never fires and stays at `scaleX: 0`. On a decorative flourish
      // that's invisible; on the rules that separate every row it means
      // the page arrives with its lines missing. Extending the observer
      // root far above the viewport makes "already scrolled past" count
      // as seen, so a skipped rule is simply present.
      //
      // The bottom edge is negative by `DRAW_LEAD` so the draw plays where
      // it can be watched; see that constant for why, and `stranded` above
      // for the end-of-document case it creates.
      //
      // `px`, not `%`: percentage root margins resolve against the root's
      // width, so a `%` would scale this vertical distance with page width.
      viewport={{ once: true, margin: `100000px 0px -${DRAW_LEAD}px 0px` }}
      // `present` collapses the duration AND the delay to zero, so a stranded
      // rule is genuinely present rather than quietly running a 0.8s draw at
      // the foot of the page. Same path reduced motion takes.
      transition={present ? { duration: 0 } : { duration: beats(1.25), ease: EASE_OUT, delay }}
    />
  );
}
