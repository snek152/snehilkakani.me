"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import OrbitStage from "./loader/OrbitStage";

/**
 * The `/loader-orbit` study mechanic (see `OrbitStage`), shown once per
 * session, scaled up for full-viewport presence. `complete` flips at the
 * same mark the study page uses; `onDone` fires at that identical instant,
 * so Hero's own entrance animation starts exactly as the marks begin
 * releasing — the same overlap the study page's `HeroResolve` demonstrates.
 * No shared-element text morph: that fought the orbit motion and kept
 * breaking. The loader simply fades out over the marks' own release,
 * handing off to Hero's existing, already-working entrance.
 */
const COMPLETE_MS = 1500;
const EXIT_MS = 650;

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
      onDoneRef.current();
    }, COMPLETE_MS);
    return () => window.clearTimeout(completeTimer);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className="fixed inset-0 z-[9999] bg-bg" />;
  }

  return (
    <motion.div
      aria-hidden
      exit={{ opacity: 0, transition: { duration: EXIT_MS / 1000 } }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-bg"
    >
      <OrbitStage complete={complete} scale={2.1} />
    </motion.div>
  );
}
