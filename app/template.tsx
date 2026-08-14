"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useNavDirection } from "@/app/lib/components/AppShell";

/**
 * Directional exposure transition. A route is revealed from the edge in the
 * direction of travel, preserving spatial context without a decorative
 * viewport overlay on every navigation.
 *
 * CAUTION — anything `position: fixed` inside a route is clipped by this.
 * A `clip-path` clips every descendant, fixed ones included, to this
 * wrapper's box, and the wrapper ends where the page content ends. The
 * settled `inset(0 0% 0 0%)` is still a clip, so the effect outlives the
 * animation: the music transport was neither painted nor hit-testable once
 * the footer owned the bottom of the window.
 *
 * Removing the clip afterwards is not available to us. Dropping `clipPath`
 * from the target makes motion fall back to rendering `initial`, which
 * clips the route away entirely; overriding it through `style` loses,
 * because motion writes animated values imperatively after React's commit;
 * and animating to `none` is not interpolatable, so it is simply ignored
 * and the settled inset stays. All three were tried and measured.
 *
 * So the rule is structural, not a workaround: viewport-docked UI portals
 * to `document.body` and lives outside this wrapper. `PlayerBar` does
 * exactly that. Anything else fixed must do the same.
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
      /* On the same BPM-92 grid as every other transition on the site, so a
       * route change lands on the pulse the incoming page's own rules draw to
       * rather than on a number picked for this file alone. `beats(0.65)` is
       * ~424ms, which is where this already was — the value did not need to
       * change, only its derivation. Kept on `useReducedMotion()` rather than
       * the site's `useMotionPreference()` hook: this wrapper sits between the
       * layout and the route, and moving it inside the provider's scope is a
       * structural change this file should not make on its own. */
      transition={{ duration: beats(0.65), ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
