"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_OUT, EASE_INOUT } from "@/app/lib/motion";
import { getPhotoDims } from "./photo-dims";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import type { Photo } from "./GalleryCell";

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
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const open = index !== null;
  const photo = open ? photos[index] : null;

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

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center p-8"
          style={{ background: "rgba(4,4,4,0.97)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : undefined}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : undefined}
            transition={reduceMotion ? { duration: 0.16 } : undefined}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-w-[88vw] flex-col"
          >
            <motion.div
              layoutId={reduceMotion ? undefined : photo.image}
              transition={{ duration: 0.5, ease: EASE_INOUT }}
            >
              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.15 }}
              >
                <ViewfinderFrame
                  captionLeft={`f/${photo.aperture} · ${photo.shutter}s · ISO ${photo.iso}`}
                  captionRight={`${String(index! + 1).padStart(2, "0")}/${photos.length}`}
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    width={getPhotoDims(photo.image).w}
                    height={getPhotoDims(photo.image).h}
                    sizes="88vw"
                    priority
                    className="block max-h-[80vh] w-auto max-w-[88vw] object-contain"
                  />
                </ViewfinderFrame>
              </motion.div>
            </motion.div>
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.15 }}
              className="mt-3"
            >
              <span id={titleId} className="text-sm text-dim">
                {photo.alt}
              </span>
              <span id={descId} className="sr-only">
                f/{photo.aperture} · {photo.shutter}s · ISO {photo.iso}
              </span>
            </motion.div>

            <motion.button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.15 }}
              className="absolute -top-9 right-0 border-0 bg-transparent p-0 text-dim transition-colors duration-150 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X size={16} strokeWidth={1.75} />
            </motion.button>

            {photos.length > 1 && (
              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.15 }}
              >
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
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
