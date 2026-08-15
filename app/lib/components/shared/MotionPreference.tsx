"use client";

import { createContext, useContext } from "react";
import { useReducedMotion } from "motion/react";

const MotionPreferenceContext = createContext<boolean | null>(null);

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
