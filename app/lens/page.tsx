"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { EASE_OUT, fadeUp } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import JustifiedGrid from "@/app/lib/components/gallery/JustifiedGrid";
import Lightbox from "@/app/lib/components/gallery/Lightbox";

export default function GalleryPage() {
  const reduceMotion = useMotionPreference();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingActive = useInView(headingRef, { once: true, margin: "0px 0px -15% 0px" });

  const openAt = useCallback((i: number) => {
    returnFocusRef.current = cellRefs.current[i] ?? null;
    setOpenIndex(i);
  }, []);

  const navigateTo = useCallback((i: number) => {
    returnFocusRef.current = cellRefs.current[i] ?? null;
    setOpenIndex(i);
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <div className="px-6 pt-16 pb-12 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
        ref={headingRef}
        className="max-w-3xl"
      >
        <ManifestoHeading
          as="h1"
          id="lens-heading"
          text="Lens"
          active={headingActive}
          className="font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg text-balance"
        />
        <motion.div
          aria-hidden="true"
          className="relative mt-10 mb-8 h-px origin-left overflow-hidden bg-border"
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduceMotion ? 0 : beats(1.2), ease: EASE_OUT }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-[38%] origin-left bg-[image:var(--seam-lens)]"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : beats(0.9), delay: reduceMotion ? 0 : beats(0.2), ease: EASE_OUT }}
          />
        </motion.div>
      </motion.div>

      <JustifiedGrid photos={featPhotos} onOpen={openAt} cellRefs={cellRefs} />

      <Lightbox
        photos={featPhotos}
        index={openIndex}
        onClose={close}
        onNavigate={navigateTo}
        returnFocusRef={returnFocusRef}
      />
    </div>
  );
}
