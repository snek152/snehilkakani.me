"use client";

import { createContext, useContext } from "react";
import { useReducedMotion } from "motion/react";

const MotionPreferenceContext = createContext<boolean | null>(null);

/**
 * Reads `prefers-reduced-motion` once here and hands it down through
 * context, as the single canonical source going forward. The codebase has
 * 25+ components that each still call `useReducedMotion()` independently
 * and re-implement their own `reduceMotion ? x : y` branching inline —
 * this provider doesn't retroactively change those; it's what `Reveal`
 * and newly-migrated components read
 * from `useMotionPreference()` instead of adding another direct call.
 * Migrating a remaining call site to this hook is a safe, incremental,
 * behavior-preserving change whenever it's touched next.
 */
export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <MotionPreferenceContext.Provider value={reduceMotion}>{children}</MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference(): boolean {
  const value = useContext(MotionPreferenceContext);
  if (value === null) {
    throw new Error("useMotionPreference must be used within a MotionPreferenceProvider");
  }
  return value;
}
