"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { fadeUp } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import JustifiedGrid from "@/app/lib/components/gallery/JustifiedGrid";
import Lightbox from "@/app/lib/components/gallery/Lightbox";

export default function GalleryPage() {
  const reduceMotion = useMotionPreference();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const headingRef = useRef<HTMLElement>(null);
  const headingActive = useInView(headingRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

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
    <div className="px-6 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-8">
      <motion.header
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
        ref={headingRef}
        className="relative mb-12 min-h-10 sm:mb-4 lg:mb-8"
      >
        <div className="relative z-10 max-w-3xl">
          <ManifestoHeading
            as="h1"
            id="lens-heading"
            text="Lens"
            active={headingActive}
            className="font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg text-balance"
          />
        </div>
        <RouteSignal
          scene="lens"
          label="Lens"
          detail="Photography"
          className="mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        />
      </motion.header>

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
