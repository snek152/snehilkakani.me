"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { fadeUp } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import JustifiedGrid from "@/app/lib/components/gallery/JustifiedGrid";
import Lightbox from "@/app/lib/components/gallery/Lightbox";

export default function GalleryPage() {
  const reduceMotion = useMotionPreference();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [exifIndex, setExifIndex] = useState<number | null>(null);
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

  const exifPhoto = exifIndex !== null ? featPhotos[exifIndex] : null;

  return (
    <div className="px-6 pt-16 pb-24 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <motion.div initial={reduceMotion ? false : "hidden"} animate="visible" variants={fadeUp} className="mb-9">
        <div ref={headingRef}>
          <ManifestoHeading
            id="lens-heading"
            text="Lens"
            active={headingActive}
            className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] text-fg"
          />
        </div>
        <p className="mt-1.5 text-sm text-dim2">Sony α6000 · {String(featPhotos.length).padStart(2, "0")} frames</p>
      </motion.div>

      <DrawnRule className="mb-8" />

      {/* Full-bleed contact sheet. At lg+ a 6rem margin column is carved
        * out of the left edge — not padding, a real reserved column — to
        * hold the hovered frame's EXIF readout out in the gutter, beside
        * the sheet rather than layered on top of a photograph. */}
      <div className="-mx-6 sm:-mx-8 lg:-mx-12">
        <div className="lg:grid lg:grid-cols-[6rem_1fr] lg:gap-6">
          <aside aria-hidden className="hidden lg:block">
            <div className="sticky top-32 pl-6">
              <motion.div
                animate={{ opacity: exifPhoto ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : beats(0.3), ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-1 font-mono text-xs tabular-nums text-dim2"
              >
                {exifPhoto ? (
                  <>
                    <span>f/{exifPhoto.aperture}</span>
                    <span>{exifPhoto.shutter}s</span>
                    <span>ISO {exifPhoto.iso}</span>
                    <span className="mt-2 text-dim2/70">
                      {String((exifIndex ?? 0) + 1).padStart(2, "0")}/{String(featPhotos.length).padStart(2, "0")}
                    </span>
                  </>
                ) : (
                  <>
                    <span>&nbsp;</span>
                    <span>&nbsp;</span>
                    <span>&nbsp;</span>
                  </>
                )}
              </motion.div>
            </div>
          </aside>

          <div className="px-6 sm:px-8 lg:px-0">
            <JustifiedGrid photos={featPhotos} onOpen={openAt} onExifChange={setExifIndex} cellRefs={cellRefs} />
          </div>
        </div>
      </div>

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
