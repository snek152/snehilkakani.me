"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { EASE_INOUT, EASE_OUT } from "@/app/lib/motion";

/**
 * Single-beat camera moment, shown once per session (gated by the caller).
 *
 * The name is a TRUE shared element: this component's name box and
 * `Hero`'s `<h1>` share `layoutId="hero-name"`. Both are mounted at the
 * same time (`AppShell` renders `children` unconditionally alongside the
 * loader), so when this component's copy unmounts, Framer Motion's
 * projection engine automatically FLIP-animates the Hero copy from this
 * box's screen position/size into its own resting layout — the exact
 * technique already proven for the Gallery lightbox
 * (`GalleryCell`/`Lightbox`, sharing `layoutId={photo.image}`). There is
 * only ever one *visible* copy of the name driving the transition; the
 * loader's copy is `aria-hidden` since Hero's `<h1>` is the single
 * accessible instance.
 *
 * Sequence (~1.4s total):
 *   1. Corner brackets (0-350ms) — the `ViewfinderFrame` bracket
 *      language, crisp snap-in (no autofocus hunt/jitter), the one
 *      supporting beat besides the name morph.
 *   2. Name box fades/rises in at its pre-positioned spot (350-800ms).
 *   3. A simple radial wipe (750-1350ms) opens from the loader's corner
 *      origin to reveal the page underneath, while brackets fade with it.
 *   4. Loader unmounts at ~1400ms; the name box's `layoutId` match with
 *      Hero's `<h1>` carries the morph the rest of the way.
 *
 * `prefers-reduced-motion` skips all of the above (no `layoutId`
 * animation) and cuts to the reveal almost immediately (~220ms), matching
 * `AppShell`'s `useIntroReady()` contract unchanged: `onDone` still fires
 * exactly once, whether animated or reduced.
 */

const TOTAL_DURATION_MS = 1400;

/** Origin the radial wipe opens from. */
const IRIS_ORIGIN = { x: 85, y: 100 };

const CORNERS = [
  { top: 0, left: 0, rotate: 0 },
  { top: 0, right: 0, rotate: 90 },
  { bottom: 0, right: 0, rotate: 180 },
  { bottom: 0, left: 0, rotate: 270 },
] as const;

/** Shared timeline (fractions of BRACKET_DURATION) for the snap-in + fade-out beat. */
const BRACKET_DURATION = 1.05;
const BRACKET_TIMES = [0, 0.35, 0.8, 1];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const delay = prefersReducedMotion ? 220 : TOTAL_DURATION_MS;
    const t = setTimeout(() => onDoneRef.current(), delay);
    return () => clearTimeout(t);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <motion.div
        key="reduced"
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="fixed inset-0 z-[9999] flex flex-col items-end justify-end bg-bg px-6 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14"
      >
        <span className="font-display text-[clamp(3.2rem,8.5vw,7.4rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-fg">
          Snehil
          <br />
          Kakani
        </span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
        className="fixed inset-0 z-[9999] overflow-hidden"
      >
        {/* Radial wipe — clips the ENTIRE loader content (panel + brackets + name)
            together, not just the background panel. This guarantees that wherever
            the wipe opens to expose the real page underneath, the loader's own
            copy of that same screen region is clipped away in the same instant —
            there is no window where Hero's real (ungated) <h1> and this name box
            can both be visible in the same place, since they'd never share a
            revealed region at once. */}
        <motion.div
          aria-hidden
          initial={{ clipPath: `circle(150% at ${IRIS_ORIGIN.x}% ${IRIS_ORIGIN.y}%)` }}
          animate={{ clipPath: `circle(0% at ${IRIS_ORIGIN.x}% ${IRIS_ORIGIN.y}%)` }}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE_INOUT }}
          className="absolute inset-0 bg-bg"
        >
          {/* Corner brackets — crisp snap-in, hold, then fade with the wipe */}
          {CORNERS.map((pos, i) => {
            const signX = "left" in pos ? -1 : 1;
            const signY = "top" in pos ? -1 : 1;
            return (
              <motion.svg
                key={i}
                aria-hidden
                width={22}
                height={22}
                viewBox="0 0 14 14"
                fill="none"
                initial={{ opacity: 0, x: signX * 6, y: signY * 6, scale: 1.3 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [signX * 6, 0, 0, 0],
                  y: [signY * 6, 0, 0, 0],
                  scale: [1.3, 1, 1, 0.9],
                }}
                transition={{ duration: BRACKET_DURATION, delay: i * 0.02, times: BRACKET_TIMES, ease: EASE_OUT }}
                className="pointer-events-none absolute m-5 text-accent"
                style={{
                  top: "top" in pos ? pos.top : undefined,
                  bottom: "bottom" in pos ? pos.bottom : undefined,
                  left: "left" in pos ? pos.left : undefined,
                  right: "right" in pos ? pos.right : undefined,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
              >
                <path d="M0 0H14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 0V14" stroke="currentColor" strokeWidth="1.5" />
              </motion.svg>
            );
          })}

          {/* Name — the single shared element. `layoutId="hero-name"` matches Hero's <h1>;
              aria-hidden since Hero's copy is the one accessible instance. No exit
              animation of its own: when this box unmounts, the projection engine FLIPs
              the matching Hero element in from this box's last screen position/size. */}
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14">
            <motion.div
              aria-hidden
              layoutId="hero-name"
              transition={{ duration: 0.5, ease: EASE_INOUT }}
              className="font-display text-[clamp(3.2rem,8.5vw,7.4rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-fg"
            >
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.35, ease: EASE_OUT }}
                className="block"
              >
                Snehil
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.4, ease: EASE_OUT }}
                className="block"
              >
                Kakani
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
