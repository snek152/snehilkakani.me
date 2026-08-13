"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_OUT, SPRING_MOMENTUM, SPRING_UI, project, rubberband } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { getPhotoDims } from "./photo-dims";
import type { Photo } from "./GalleryCell";
import Exposure from "./Exposure";

/** Movement, in px, before a pointer gesture on the photo commits to an
 * axis (horizontal swipe vs. vertical dismiss) rather than being read as a
 * tap or a scroll wobble. Hysteresis, not a final-state threshold — once
 * crossed, the photo tracks the pointer continuously on that axis. */
const AXIS_HYSTERESIS = 10;

/** The displayed width the browser should pick a source for. Derived per
 * photo rather than using the shell's flat width: the shell is
 * height-capped (`min(76vh, 780px)`), and `object-contain` scales each
 * photo to fit that box by its own aspect ratio. A portrait renders far
 * narrower than the shell's width, so hinting the shell width for every
 * photo made the browser fetch sources ~2-3x wider (which is ~7-9x the
 * pixels) than what a portrait actually displays at. */
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
  // Backdrop lightens as the vertical drag grows, previewing the
  // dismissal continuously instead of only revealing it at release.
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
  // Suppresses the backdrop's click-to-close for the click that trails a
  // drag release, so letting go of a swipe never also dismisses.
  const isDraggingRef = useRef(false);

  // Manual dual-layer crossfade instead of a nested `AnimatePresence`:
  // the previous frame stays fully opaque underneath (no exit
  // animation to track) while the next frame mounts fresh and fades
  // in over it, then the old layer is dropped. A nested
  // `AnimatePresence` here previously stalled the *outer* dialog's own
  // exit — its `onExitComplete` never fired — so this sidesteps that
  // entirely rather than fighting it.
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
    if (layers.length < 2) return;
    const timer = setTimeout(() => {
      setLayers((prev) => (prev.length > 1 ? prev.slice(prev.length - 1) : prev));
    }, beats(0.35) * 1000 + 50);
    return () => clearTimeout(timer);
  }, [layers]);

  // Lock body scroll while open; restore on close/unmount.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus to Close on open; return focus to the originating thumbnail on close.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else {
      returnFocusRef.current?.focus();
    }
  }, [open, returnFocusRef]);

  /* Reset the drag offsets whenever the dialog opens.
   *
   * `AnimatePresence` unmounts the inner dialog, but these motion values live
   * on `Lightbox` itself, which stays mounted — so after a drag-to-dismiss `y`
   * is still parked at `stageH + 200`. Without this, the next open would mount
   * the photo already off the bottom of the screen. Any settle animation still
   * in flight from the previous session is stopped first, or it would keep
   * driving the value straight back out. */
  useEffect(() => {
    if (!open) return;
    x.stop();
    y.stop();
    x.set(0);
    y.set(0);
  }, [open, x, y]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate((index! - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate((index! + 1) % photos.length);
      } else if (e.key === "Tab") {
        // Focus trap: the dialog is a portal-less overlay stacked on top of
        // the page, so without this Tab walks straight into the page
        // content sitting behind it. Cycle within the dialog's own buttons
        // (Close, and Prev/Next when there's more than one photo) instead.
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
  }, [open, index, photos.length, onClose, onNavigate]);

  // Neighbour preloading is done by RENDERING the neighbours, hidden, with
  // exactly the props the visible image uses — see the hidden block in the
  // markup below.
  //
  // The obvious approach does not work and is actively harmful. `new
  // Image().src = photo.image` warms `/photos/foo.jpg`, but `next/image`
  // requests `/_next/image?url=%2Fphotos%2Ffoo.jpg&w=...&q=75`. Those are
  // different URLs, so the preload warmed nothing the lightbox would ever
  // ask for — while downloading the untouched original, which in this
  // gallery runs to 4.6MB. Two of those per navigation, competing for
  // bandwidth with the optimized image actually being displayed, is what
  // made the lightbox feel like it took forever to load.
  //
  // Letting `next/image` generate the neighbour URLs keeps them identical
  // to the displayed one by construction, rather than by reimplementing
  // Next's URL format here and hoping it does not drift.

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

    // Short rolling history — velocity at release comes from the last few
    // samples, not the whole gesture, so a drag that drifted slowly and
    // then flicked at the end reads as a flick.
    state.history.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    if (state.history.length > 5) state.history.shift();

    if (state.axis === null) {
      if (Math.abs(dx) < AXIS_HYSTERESIS && Math.abs(dy) < AXIS_HYSTERESIS) return;
      state.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      isDraggingRef.current = true;
    }

    // Only swallow the gesture once it is committed to an axis — a tap, or
    // a touch that never crosses the hysteresis, must still reach the
    // chrome buttons underneath.
    e.preventDefault();

    if (state.axis === "x") {
      x.set(dx);
    } else {
      // Downward is the dismissal direction, so it tracks the finger exactly:
      // resistance here would make the photo lag the hand, which is the one
      // thing direct manipulation cannot do. Upward has nothing behind it, so
      // that is where resistance belongs — the photo follows less and less the
      // further it is pulled against the gesture, which reads as "there is
      // nothing up here" instead of as a dead edge.
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
      isDraggingRef.current = false;
      return;
    }

    // Velocity from the recent window only, in px/s — never from total
    // distance over total time, which is what let a slow long drag commit
    // while a fast short flick was ignored.
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
      // Dismissal is downward ONLY, which is what makes the upward resistance
      // in `handlePointerMove` mean something: down is a door, up is a wall.
      // Both tests are signed rather than absolute — an upward flick, however
      // hard, springs back instead of closing.
      const decisive = vy > 800;

      if (projected > state.stageH * 0.25 || decisive) {
        const exitY = state.stageH + 200;
        const exitTransition = reduceMotion ? { duration: 0 } : { ...SPRING_MOMENTUM, velocity: vy };
        // Leaves along the path the drag took, so the photo exits through the
        // bottom it was pulled toward rather than fading in place.
        animate(y, exitY, exitTransition).then(() => {
          onClose();
        });
      } else {
        const settleTransition = reduceMotion ? { duration: 0 } : { ...SPRING_UI, velocity: vy };
        animate(y, 0, settleTransition);
      }
    }

    // The click that trails a drag release still needs to see the flag —
    // clear it after this tick rather than synchronously.
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  // Press feedback for the three chrome buttons, on pointer-down rather
  // than on release. These are 16-22px glyphs, so a scale alone is a
  // fraction of a pixel and effectively invisible; the lift to full weight
  // is what actually reads as a press — and on touch it is the only signal
  // there is, since no hover precedes the tap. `transition-[color,scale]`
  // names both properties: Tailwind v4 emits `scale-*` as the standalone
  // `scale` property, so `transition-colors` alone would leave the press
  // snapping. The small scale remains under reduced motion because it is
  // direct-manipulation feedback; colour is the redundant non-motion cue.
  const pressClass =
    "transition-[color,scale] duration-[120ms] ease-[var(--ease-press)] active:scale-[0.95] active:text-fg";

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          ref={dialogRef}
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: beats(0.4) }}
          onClick={() => {
            if (isDraggingRef.current) return;
            onClose();
          }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "rgba(4,4,4,0.97)", opacity: backdropOpacity }}
          />
          <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col items-center">
            {/* Fixed shell: a constant box, sized from the viewport and
              * never from the photo. Navigating between a portrait and a
              * landscape frame crossfades the image inside this box
              * instead of resizing the box around the image. */}
            <motion.div
              ref={frameRef}
              data-testid="lightbox-frame"
              className="relative flex touch-none items-center justify-center"
              style={{ width: "min(88vw, 1100px)", height: "min(76vh, 780px)", x, y }}
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
            </motion.div>

            {/* Same caption shape as the grid: title, then the exposure line
              * in tabular figures under it. */}
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

            {/* Neighbours, rendered rather than hand-preloaded, so their URLs
              * are generated by the same component that will request them.
              * `loading="eager"` is required: the default is lazy, and a
              * zero-opacity offscreen image would never be fetched, which
              * would silently make this do nothing. Not `display:none` for
              * the same reason. */}
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
              onClick={onClose}
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
      )}
    </AnimatePresence>
  );
}
