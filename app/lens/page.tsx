"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { fadeUp } from "@/app/lib/motion";
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
    <div className="px-6 pt-16 pb-24 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
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
        <p className="mt-5 max-w-xl text-[length:var(--text-body)] leading-relaxed text-dim">
          A contact sheet of found light, held in the order each frame asks to be read.
        </p>
      </motion.div>

      <div className="relative mt-10 mb-8 h-px overflow-hidden bg-border" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-transparent via-[#5575d9] to-[#8b66c9]" />
      </div>

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
