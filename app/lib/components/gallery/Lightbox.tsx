"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { getPhotoDims } from "./photo-dims";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import type { Photo } from "./GalleryCell";

/** Minimum horizontal drag, in px, before a touch gesture counts as a
 * swipe-to-navigate rather than a tap or a scroll wobble. */
const SWIPE_THRESHOLD = 50;

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
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();
  const descId = useId();
  const open = index !== null;
  const photo = open ? photos[index] : null;

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
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, index, photos.length, onClose, onNavigate]);

  // Preload both neighbours so ArrowLeft/ArrowRight (and a swipe) never
  // wait on a network fetch — only the crossfade transition is visible.
  useEffect(() => {
    if (!open || index === null) return;
    [index - 1, index + 1].forEach((i) => {
      const neighbour = photos[(i + photos.length) % photos.length];
      if (!neighbour) return;
      const img = new window.Image();
      img.src = neighbour.image;
    });
  }, [open, index, photos]);

  const handleTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null || index === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) onNavigate((index + 1) % photos.length);
    else onNavigate((index - 1 + photos.length) % photos.length);
  };

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: beats(0.4) }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center p-8"
          style={{ background: "rgba(4,4,4,0.97)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col items-center">
            {/* Fixed shell: a constant box, sized from the viewport and
              * never from the photo. Navigating between a portrait and a
              * landscape frame crossfades the image inside this box
              * instead of resizing the box around the image. */}
            <div
              data-testid="lightbox-frame"
              className="relative flex items-center justify-center"
              style={{ width: "min(88vw, 1100px)", height: "min(76vh, 780px)" }}
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
                  <ViewfinderFrame
                    captionLeft={`f/${layer.photo.aperture} · ${layer.photo.shutter}s · ISO ${layer.photo.iso}`}
                    captionRight={`${String(photos.indexOf(layer.photo) + 1).padStart(2, "0")}/${photos.length}`}
                    className="max-h-[76vh] max-w-[88vw]"
                  >
                    <Image
                      src={layer.photo.image}
                      alt={layer.photo.alt}
                      width={getPhotoDims(layer.photo.image).w}
                      height={getPhotoDims(layer.photo.image).h}
                      sizes="88vw"
                      priority
                      className="block max-h-[76vh] w-auto max-w-[88vw] object-contain"
                    />
                  </ViewfinderFrame>
                </motion.div>
              ))}
            </div>

            <div className="mt-3">
              <span id={titleId} className="text-sm text-dim">
                {photo.alt}
              </span>
              <span id={descId} className="sr-only">
                f/{photo.aperture} · {photo.shutter}s · ISO {photo.iso}
              </span>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="absolute -top-9 right-0 border-0 bg-transparent p-0 text-dim transition-colors duration-150 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X size={16} strokeWidth={1.75} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate((index! - 1 + photos.length) % photos.length)}
                  aria-label="Previous photo"
                  className="absolute top-1/2 -left-4 -translate-x-full -translate-y-1/2 border-0 bg-transparent p-2 text-dim transition-colors duration-150 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent max-lg:hidden"
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate((index! + 1) % photos.length)}
                  aria-label="Next photo"
                  className="absolute top-1/2 -right-4 translate-x-full -translate-y-1/2 border-0 bg-transparent p-2 text-dim transition-colors duration-150 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent max-lg:hidden"
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
