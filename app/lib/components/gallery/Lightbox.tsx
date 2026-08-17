"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_OUT, SPRING_MOMENTUM, SPRING_UI, project, rubberband } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { getPhotoDims } from "./photo-dims";
import type { Photo } from "./GalleryCell";
import Exposure from "./Exposure";

const AXIS_HYSTERESIS = 10;

function lightboxSizesFor(image: string): string {
  const { w, h } = getPhotoDims(image);
  const aspect = w / h;
  return `min(88vw, 1100px, calc(min(76vh, 780px) * ${aspect}))`;
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
  returnFocusRef,
}: {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  returnFocusRef: React.MutableRefObject<HTMLButtonElement | null>;
}) {
  const reduceMotion = useMotionPreference();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const open = index !== null;
  const photo = open ? photos[index] : null;

  const frameRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const backdropOpacity = useTransform(y, (latest) => Math.max(1 - Math.abs(latest) / 500, 0.15));

  type DragState = {
    pointerId: number;
    startX: number;
    startY: number;
    axis: "x" | "y" | null;
    history: { x: number; y: number; t: number }[];
    stageW: number;
    stageH: number;
  };
  const dragState = useRef<DragState | null>(null);

  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const [layers, setLayers] = useState<{ key: string; photo: Photo }[]>([]);

  useEffect(() => {
    if (!photo) {
      setLayers([]);
      return;
    }
    setLayers((prev) => {
      if (prev.length && prev[prev.length - 1].photo.image === photo.image) return prev;
      const next = [...prev, { key: `${photo.image}-${Date.now()}`, photo }];
      return next.length > 2 ? next.slice(next.length - 2) : next;
    });
  }, [photo]);


  useEffect(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setClosing(false);
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [index]);
  useEffect(() => {
    if (layers.length < 2) return;
    const timer = setTimeout(() => {
      setLayers((prev) => (prev.length > 1 ? prev.slice(prev.length - 1) : prev));
    }, beats(0.35) * 1000 + 50);
    return () => clearTimeout(timer);
  }, [layers]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else {
      returnFocusRef.current?.focus();
    }
  }, [open, returnFocusRef]);

  useEffect(() => {
    if (!open) return;
    x.stop();
    y.stop();
    x.set(0);
    y.set(0);
  }, [open, x, y]);
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    if (reduceMotion) {
      onClose();
      return;
    }
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, beats(0.4) * 1000);
  }, [closing, onClose, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
    if (closing) return;
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate((index! - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate((index! + 1) % photos.length);
      } else if (e.key === "Tab") {
        const container = dialogRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll<HTMLButtonElement>("button:not([disabled])"),
        ).filter((button) => button.getClientRects().length > 0);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first || !container.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !container.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closing, open, index, photos.length, onNavigate, requestClose]);


  const neighbours =
    open && index !== null
      ? [
          photos[(index - 1 + photos.length) % photos.length],
          photos[(index + 1) % photos.length],
        ].filter((p): p is Photo => Boolean(p) && p.image !== photos[index].image)
      : [];

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (index === null) return;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const rect = target.getBoundingClientRect();
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      axis: null,
      history: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }],
      stageW: rect.width,
      stageH: rect.height,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state || e.pointerId !== state.pointerId) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    state.history.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    if (state.history.length > 5) state.history.shift();

    if (state.axis === null) {
      if (Math.abs(dx) < AXIS_HYSTERESIS && Math.abs(dy) < AXIS_HYSTERESIS) return;
      state.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    e.preventDefault();

    if (state.axis === "x") {
      x.set(dx);
    } else {
      y.set(dy >= 0 ? dy : -rubberband(-dy, state.stageH));
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state || e.pointerId !== state.pointerId) return;
    dragState.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (state.axis === null || index === null) {
      return;
    }

    const first = state.history[0];
    const last = state.history[state.history.length - 1];
    const dt = (last.t - first.t) / 1000;
    const vx = dt > 0 ? (last.x - first.x) / dt : 0;
    const vy = dt > 0 ? (last.y - first.y) / dt : 0;
    if (state.axis === "x") {
      const projected = x.get() + project(vx);
      const settleTransition = reduceMotion ? { duration: 0 } : { ...SPRING_UI, velocity: vx };

      if (Math.abs(projected) > state.stageW / 3) {
        const dir = projected < 0 ? 1 : -1;
        const newIndex =
          dir === 1 ? (index + 1) % photos.length : (index - 1 + photos.length) % photos.length;
        const exitX = dir * -state.stageW;
        const exitTransition = reduceMotion ? { duration: 0 } : { ...SPRING_MOMENTUM, velocity: vx };
        animate(x, exitX, exitTransition).then(() => {
          onNavigate(newIndex);
          x.set(-exitX);
          animate(x, 0, settleTransition);
        });
      } else {
        animate(x, 0, settleTransition);
      }
    } else {
      const projected = y.get() + project(vy);

      const decisive = vy > 800;
      if (projected > state.stageH * 0.25 || decisive) {
        const exitY = state.stageH + 200;
        const exitTransition = reduceMotion ? { duration: 0 } : { ...SPRING_MOMENTUM, velocity: vy };

        animate(y, exitY, exitTransition).then(requestClose);
      } else {
        const settleTransition = reduceMotion ? { duration: 0 } : { ...SPRING_UI, velocity: vy };
        animate(y, 0, settleTransition);
      }
    }

  };

  const pressClass =
    "transition-[color,scale] duration-[120ms] ease-[var(--ease-press)] active:scale-[0.95] active:text-fg";

  return open && photo ? (
        <motion.div
          ref={dialogRef}
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: beats(0.4), ease: EASE_OUT }}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center p-8"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >

          <motion.div
            aria-hidden
            data-material=""
            onClick={requestClose}
            className="absolute inset-0 cursor-pointer backdrop-blur-[18px]"
            style={{ background: "var(--scrim)", opacity: backdropOpacity }}
          />
          <div className={`relative flex flex-col items-center${closing ? " pointer-events-none" : ""}`}>
            <motion.div
              ref={frameRef}
              data-testid="lightbox-frame"
              className="relative flex touch-none items-center justify-center"
              style={{ width: lightboxSizesFor(photo.image), height: "min(76vh, 780px)", x, y }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {layers.map((layer, i) => (
                <motion.div
                  key={layer.key}
                  initial={reduceMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: beats(0.35), ease: EASE_OUT }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: i }}
                >
                  <Image
                    src={layer.photo.image}
                    alt={layer.photo.alt}
                    width={getPhotoDims(layer.photo.image).w}
                    height={getPhotoDims(layer.photo.image).h}
                    sizes={lightboxSizesFor(layer.photo.image)}
                    priority
                    className="block max-h-[76vh] w-auto max-w-[88vw] object-contain"
                  />
                </motion.div>
              ))}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onNavigate((index! - 1 + photos.length) % photos.length)}
                    aria-label="Previous photo"
                    className={`absolute bottom-3 left-3 z-10 border-0 bg-bg/70 p-3 text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden ${pressClass}`}
                  >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onNavigate((index! + 1) % photos.length)}
                    aria-label="Next photo"
                    className={`absolute right-3 bottom-3 z-10 border-0 bg-bg/70 p-3 text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden ${pressClass}`}
                  >
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </motion.div>

            <div className="mt-4 max-w-[min(88vw,1100px)] text-center">
              <span id={titleId} className="block text-[length:var(--text-meta)] font-medium text-fg">
                {photo.alt}
              </span>
              <Exposure
                id={descId}
                photo={photo}
                className="mt-1.5 justify-center"
              />
            </div>

            <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
              {neighbours.map((n) => (
                <Image
                  key={n.image}
                  src={n.image}
                  alt=""
                  width={getPhotoDims(n.image).w}
                  height={getPhotoDims(n.image).h}
                  sizes={lightboxSizesFor(n.image)}
                  loading="eager"
                />
              ))}
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              aria-label="Close lightbox"
              className={`absolute -top-9 right-0 border-0 bg-transparent p-0 text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${pressClass}`}
            >
              <X size={16} strokeWidth={1.75} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate((index! - 1 + photos.length) % photos.length)}
                  aria-label="Previous photo"
                  className={`absolute top-1/2 -left-4 -translate-x-full -translate-y-1/2 border-0 bg-transparent p-2 text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent max-lg:hidden ${pressClass}`}
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate((index! + 1) % photos.length)}
                  aria-label="Next photo"
                  className={`absolute top-1/2 -right-4 translate-x-full -translate-y-1/2 border-0 bg-transparent p-2 text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent max-lg:hidden ${pressClass}`}
                >
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </motion.div>
  ) : null;
}
