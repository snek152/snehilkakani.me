import type { Variants } from "motion/react";
import { beats } from "./tempo";

/** Primary entrance easing — snappy deceleration. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Curtains / big choreographed moves. */
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

/** Shared entrance: content arrives by coming INTO FOCUS.
 *
 * Not a flat fade-and-rise. The site's signature motif is a viewfinder
 * (`ViewfinderFrame`'s corner brackets contracting onto a frame), and what a
 * viewfinder does is lock focus — so things arriving here resolve out of
 * defocus, slightly back in space, and settle forward into sharpness. That is
 * the same optical language `WaveField` uses for depth: it recedes by going
 * SOFT, never by going dark.
 *
 * This is deliberate weaving. The interface is otherwise entirely flat and
 * orthogonal — before this, every transform on the site was `opacity`, `y`,
 * `scaleX/Y` or `clipPath`, with zero `perspective`, `translateZ` or
 * defocus anywhere outside the wave canvas. Two sealed registers, one with
 * space in it and one without. An entrance that focuses in gives the flat
 * interface somewhere to arrive FROM.
 *
 * `blur` is the one non-compositor property here, which is why it is scoped to
 * entrances — bounded, one-shot, a handful of elements per viewport — and
 * never to anything continuous or gesture-driven.
 *
 * Duration comes off the tempo grid so every header lands on the same beat as
 * the rest of the site's motion. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.982, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: beats(0.75), ease: EASE_OUT },
  },
};

/** Stagger container for lists of entrance-animated children. Interval
 * derives from the tempo grid, same as every other reveal timing. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: beats(0.1) },
  },
};

/* ---------------------------------------------------------------------------
 * Springs, for anything a hand touches.
 *
 * Entrances above are duration-based on purpose: they are choreography on the
 * BPM-92 grid, nobody interrupts them, and a fixed curve is the right tool.
 * Gestures are the opposite case. A duration cannot answer new input, so a
 * drag that is grabbed, reversed, or thrown needs a spring — it animates from
 * wherever the value currently is and re-targets without a jump.
 *
 * Expressed in Apple's two parameters rather than mass/stiffness/damping:
 * `bounce` is the damping ratio inverted (0 = critically damped, no overshoot)
 * and `duration` is the response — how fast it reaches the target, not how
 * long it is allowed to take.
 *
 * Overshoot is earned, never decorative: it belongs only where the gesture
 * itself carried momentum. A panel that merely appeared has no momentum to
 * express, so it gets `bounce: 0`.
 * ------------------------------------------------------------------------- */

/** Default for UI that moves without being thrown: rails, panels, repositions. */
export const SPRING_UI = { type: "spring", bounce: 0, duration: 0.4 } as const;

/** Sheets and drawers — slightly quicker response, still no overshoot. */
export const SPRING_DRAWER = { type: "spring", bounce: 0, duration: 0.3 } as const;

/** Only for a release that carried velocity: a flick, a throw, a drag let go. */
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

/**
 * Where a flick would come to rest, given the velocity it was released at.
 *
 * This is the exponential-decay projection scroll views use, NOT the
 * textbook `v^2 / 2a`. Committing on projected rest rather than on distance
 * travelled is what makes a short fast flick feel like a throw instead of an
 * ignored gesture.
 *
 * @param velocity px/s at release
 * @param decelerationRate 0.998 matches normal scroll feel; 0.99 is snappier
 */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary. The further out you drag, the less
 * the element follows, so an edge reads as "responsive, but there is nothing
 * more here" instead of as a frozen interface.
 *
 * @param overshoot px dragged beyond the bound
 * @param dimension the travel the gesture is measured against (usually width)
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
