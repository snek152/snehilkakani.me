"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import OrbitStage, { RELEASE_MS } from "./loader/OrbitStage";

/**
 * The `/loader-orbit` study mechanic (see `OrbitStage`), shown once per
 * session, scaled up for full-viewport presence. `complete` flips at the
 * same mark the study page uses. The local update commits before the parent
 * begins the backdrop exit, so this now-releasing, aria-hidden layer no
 * longer captures input during its own fade. The backdrop's exit fade shares
 * `RELEASE_MS` with `OrbitStage` so the black backdrop and the marks/lines/
 * group finish dissolving together.
 */
const COMPLETE_MS = 1500;
const EXIT_MS = RELEASE_MS;

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => onDoneRef.current(), 160);
      return () => window.clearTimeout(timer);
    }
    const completeTimer = window.setTimeout(() => {
      setComplete(true);
    }, COMPLETE_MS);
    return () => window.clearTimeout(completeTimer);
  }, [prefersReducedMotion]);

  /* Schedule the parent handoff one task after the local `complete` render.
   * React batches timer updates, so calling `onDone` alongside `setComplete`
   * can move this exiting child into AnimatePresence with its pre-complete
   * class still attached (`pointer-events: auto`). */
  useEffect(() => {
    if (!complete) return;
    const doneTimer = window.setTimeout(() => onDoneRef.current(), 0);
    return () => window.clearTimeout(doneTimer);
  }, [complete]);

  /* The opaque gather intentionally owns the screen. Once `complete` starts,
   * though, the page is visible beneath a decorative, aria-hidden exit; it
   * must stop intercepting input immediately rather than holding clicks for
   * the 900ms release. This also prevents a stalled exit animation from
   * trapping the entire page behind an inert overlay. */
  if (prefersReducedMotion) {
    return <div className="fixed inset-0 z-[9999] bg-bg" />;
  }

  return (
    <motion.div
      aria-hidden
      exit={{ opacity: 0, transition: { duration: EXIT_MS / 1000 } }}
      className={`fixed inset-0 z-[9999] overflow-hidden bg-bg ${
        complete ? "pointer-events-none" : ""
      }`}
    >
      <OrbitStage complete={complete} scale={2.1} />
    </motion.div>
  );
}
