"use client";

import { createContext, useContext, useEffect, useState, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import { useMotionPreference } from "./MotionPreference";

type CursorFieldValue = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** False under reduced motion, coarse/touch pointers, or before the
   * pointer has moved at all — cheap for consumers to bail out on before
   * they subscribe to movement. */
  active: boolean;
};

const CursorFieldContext = createContext<CursorFieldValue | null>(null);

/**
 * One shared pointer position for the whole page, held as motion values
 * (not React state) — `CursorGlow` used to track its own `mousemove`
 * listener in isolation; now it and anything else that wants to react to
 * the cursor (`useProximity`) read from this single source. Motion values
 * update outside React's render cycle, so a page full of proximity
 * subscribers never re-renders on every mouse move.
 */
export function CursorFieldProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useMotionPreference();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || isCoarsePointer) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHasMoved(true);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, isCoarsePointer, x, y]);

  const active = hasMoved && !reduceMotion && !isCoarsePointer;

  return <CursorFieldContext.Provider value={{ x, y, active }}>{children}</CursorFieldContext.Provider>;
}

export function useCursorField(): CursorFieldValue {
  const ctx = useContext(CursorFieldContext);
  if (!ctx) {
    throw new Error("useCursorField must be used within a CursorFieldProvider");
  }
  return ctx;
}

/**
 * 0 (far) to 1 (cursor centered on the element) closeness between the
 * cursor and `ref`. Recomputed on actual pointer movement — subscribed
 * via the cursor motion values' `on("change", ...)`, not a perpetual
 * `requestAnimationFrame` loop — so it does real work only while the
 * mouse is actually moving and goes idle the instant it stops, however
 * many elements are subscribed. A stationary cursor over a scrolling
 * page would otherwise go stale (the element's rect moves, the pointer
 * doesn't), so `scroll`/`resize` also trigger one rAF-throttled
 * recompute. Returned as a `MotionValue` so callers bind it straight to
 * `style` — no React re-renders for the whole page's worth of
 * subscribers.
 */
export function useProximity(ref: RefObject<HTMLElement | null>, radius = 200): MotionValue<number> {
  const { x, y, active } = useCursorField();
  const proximity = useMotionValue(0);

  useEffect(() => {
    if (!active) {
      proximity.set(0);
      return;
    }
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = x.get() - (rect.left + rect.width / 2);
      const dy = y.get() - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      proximity.set(Math.max(0, 1 - distance / radius));
    };
    // rAF-throttled so a burst of triggers (x AND y both changing on the
    // same pointer event, or a scroll) collapses to one rect read per
    // frame rather than one per event.
    let scheduled = false;
    let frameId = 0;
    const scheduleUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      frameId = requestAnimationFrame(() => {
        scheduled = false;
        update();
      });
    };

    update();
    const unsubX = x.on("change", scheduleUpdate);
    const unsubY = y.on("change", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      unsubX();
      unsubY();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(frameId);
    };
  }, [active, ref, x, y, radius, proximity]);

  return proximity;
}
