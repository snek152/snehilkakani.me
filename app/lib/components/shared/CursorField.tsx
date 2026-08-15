"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type RefObject,
} from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import { useMotionPreference } from "./MotionPreference";

type CursorFieldValue = {
  x: MotionValue<number>;
  y: MotionValue<number>;

  layoutTick: MotionValue<number>;

  active: boolean;
};

const CursorFieldContext = createContext<CursorFieldValue | null>(null);

export function CursorFieldProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useMotionPreference();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const layoutTick = useMotionValue(0);
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

  useEffect(() => {
    if (reduceMotion || isCoarsePointer) return;
    let scheduled = false;
    let frameId = 0;
    const bump = () => {
      if (scheduled) return;
      scheduled = true;
      frameId = requestAnimationFrame(() => {
        scheduled = false;
        layoutTick.set(layoutTick.get() + 1);
      });
    };
    window.addEventListener("scroll", bump, { passive: true });
    window.addEventListener("resize", bump);
    return () => {
      window.removeEventListener("scroll", bump);
      window.removeEventListener("resize", bump);
      cancelAnimationFrame(frameId);
    };
  }, [reduceMotion, isCoarsePointer, layoutTick]);

  const active = hasMoved && !reduceMotion && !isCoarsePointer;

  return (
    <CursorFieldContext.Provider value={{ x, y, layoutTick, active }}>
      {children}
    </CursorFieldContext.Provider>
  );
}

export function useCursorField(): CursorFieldValue {
  const ctx = useContext(CursorFieldContext);
  if (!ctx) {
    throw new Error("useCursorField must be used within a CursorFieldProvider");
  }
  return ctx;
}

export function useProximity(
  ref: RefObject<HTMLElement | null>,
  radius = 200,
): MotionValue<number> {
  const { x, y, layoutTick, active } = useCursorField();
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
    const unsubTick = layoutTick.on("change", scheduleUpdate);
    return () => {
      unsubX();
      unsubY();
      unsubTick();
      cancelAnimationFrame(frameId);
    };
  }, [active, ref, x, y, layoutTick, radius, proximity]);

  return proximity;
}
