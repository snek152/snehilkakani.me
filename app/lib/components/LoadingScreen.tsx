"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import OrbitStage, { RELEASE_MS } from "./loader/OrbitStage";

const COMPLETE_MS = 1500;
const EXIT_MS = RELEASE_MS;

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const [complete, setComplete] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const completeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => onDoneRef.current(), 160);
      return () => window.clearTimeout(timer);
    }
    completeTimerRef.current = window.setTimeout(() => {
      completeTimerRef.current = null;
      setComplete(true);
    }, COMPLETE_MS);
    return () => {
      if (completeTimerRef.current !== null) {
        window.clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  const skip = () => {
    if (completeTimerRef.current !== null) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
    setComplete(true);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    overlayRef.current?.focus();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!complete) return;
    const doneTimer = window.setTimeout(() => onDoneRef.current(), 0);
    return () => window.clearTimeout(doneTimer);
  }, [complete]);

  if (prefersReducedMotion) {
    return <div data-loader className="fixed inset-0 z-[9999] bg-bg" />;
  }

  return (
    <motion.div
      ref={overlayRef}
      data-loader
      role="button"
      tabIndex={0}
      aria-label="Skip intro animation"
      exit={{ opacity: 0, transition: { duration: EXIT_MS / 1000 } }}
      className={`fixed inset-0 z-[9999] overflow-hidden bg-bg outline-none ${
        complete ? "pointer-events-none" : ""
      }`}
      onPointerDown={skip}
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          skip();
        }
      }}
    >
      <OrbitStage complete={complete} scale={2.1} />
    </motion.div>
  );
}
