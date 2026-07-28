"use client";

import { motion, type TargetAndTransition } from "motion/react";
import { EASE_INOUT, EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "./MotionPreference";

export type RevealVariant = "fade-up" | "fade" | "scale-in" | "mask-wipe";

const VARIANTS: Record<
  Exclude<RevealVariant, "mask-wipe">,
  (y: number) => { hidden: TargetAndTransition; visible: TargetAndTransition }
> = {
  "fade-up": (y) => ({ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }),
  fade: () => ({ hidden: { opacity: 0 }, visible: { opacity: 1 } }),
  "scale-in": () => ({ hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } }),
};

/** Every plain DOM/motion attribute (aria-*, id, role, data-*, ...) except
 * the ones this component itself controls — forwarded generically rather
 * than re-added one named prop at a time as new needs come up. Rendered
 * target is always `motion.div` (even the reduced-motion branch, simply
 * without animation props) so the forwarded type never has to reconcile
 * plain-DOM and framer-motion handler signatures (e.g. `onDrag`) against
 * each other. */
type ForwardedDivProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  "initial" | "animate" | "whileInView" | "viewport" | "transition" | "children" | "className" | "style"
>;

type RevealProps = ForwardedDivProps & {
  children: React.ReactNode;
  /** Named variant, not a pile of boolean flags. Defaults to "fade-up",
   * which reproduces the site's existing standard entrance pattern
   * (opacity/y, `whileInView`, `once: true`); duration/delay derive from
   * the shared tempo grid (`app/lib/tempo.ts`) rather than a bare number
   * picked in isolation, so entrances elsewhere land on the same pulse. */
  variant?: RevealVariant;
  /** Vertical offset in px for "fade-up" only. */
  y?: number;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
  /** React 19 lets function components accept `ref` as a plain prop —
   * no `forwardRef` wrapper needed. Used e.g. by `ExperienceAccordion`
   * to hand this element's node to `useProximity`. */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The site's single reveal-on-scroll primitive. Reduced motion is read
 * once from `useMotionPreference()` instead of every caller re-deriving
 * its own `reduceMotion ? {...} : {...}` branch — this replaced that
 * duplicated boilerplate in Marquee and ExperienceAccordion. Renders a
 * plain `div` (via `motion.div` with no animation props), so it's only
 * used where a `div` root is appropriate — components needing a semantic
 * root (`nav`, `section`, `article`) keep their own markup and just read
 * `useMotionPreference()` directly instead.
 *
 * `viewport={{ once: true }}` always — every scroll reveal on this site
 * fires exactly once, so it's not exposed as a prop with only one real
 * value.
 *
 * "mask-wipe" is an additional named variant (not the default, not
 * applied anywhere automatically): an overflow-hidden clip with content
 * sliding up from behind a hard edge, for the rare heading that wants a
 * more deliberate reveal than a diffuse fade. Opt in explicitly per call
 * site; nothing switches to it on its own.
 */
export function Reveal({
  children,
  variant = "fade-up",
  y = 20,
  delay = 0,
  duration = beats(0.75),
  amount = 0.3,
  className,
  ref,
  ...rest
}: RevealProps) {
  const reduceMotion = useMotionPreference();

  if (reduceMotion) {
    return (
      <motion.div ref={ref} className={className} {...rest}>
        {children}
      </motion.div>
    );
  }

  if (variant === "mask-wipe") {
    return (
      <motion.div ref={ref} className={className} style={{ overflow: "hidden" }} {...rest}>
        <motion.div
          initial={{ y: "110%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, amount }}
          transition={{ duration: duration + 0.25, delay, ease: EASE_INOUT }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  const { hidden, visible } = VARIANTS[variant](y);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
