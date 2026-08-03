"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, LayoutGroup } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { fadeUp } from "@/app/lib/motion";
import { getPhotoDims } from "@/app/lib/components/gallery/photo-dims";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import GalleryCell from "@/app/lib/components/gallery/GalleryCell";
import Lightbox from "@/app/lib/components/gallery/Lightbox";

// A single lead shot opens the page as a genuine cover image rather than
// dropping straight into a uniform grid — the one deliberate "isBig" call
// this gallery makes, instead of repeating accent chrome across the ~40%
// of photos flagged `isBig` (which would read as noise, not hierarchy).
// It keeps its original index into `featPhotos` throughout — the grid
// below skips that index rather than filtering/remapping the array, so
// `openAt`/`navigateTo`/`Lightbox` never see a reordered list.
const leadIndex = featPhotos.findIndex((p) => p.isBig);

export default function GalleryPage() {
  const reduceMotion = useMotionPreference();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const openAt = useCallback((i: number) => {
    returnFocusRef.current = cellRefs.current[i] ?? null;
    setOpenIndex(i);
  }, []);

  const navigateTo = useCallback((i: number) => {
    returnFocusRef.current = cellRefs.current[i] ?? null;
    setOpenIndex(i);
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);

  const lead = leadIndex !== -1 ? featPhotos[leadIndex] : null;
  const leadDims = lead ? getPhotoDims(lead.image) : null;
  // Never crop the lead, whichever orientation it happens to be — a
  // portrait shot gets a narrower, centered treatment instead of being
  // forced into a wide banner and cropped down to fit one.
  const leadPortrait = leadDims ? leadDims.h > leadDims.w : false;

  return (
    <LayoutGroup>
      <div className="px-6 pt-16 pb-20 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-9 flex items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] text-fg">
              Lens
            </h1>
            <p className="mt-1.5 text-sm text-dim2">Sony α6000 · {String(featPhotos.length).padStart(2, "0")} frames</p>
          </div>
        </motion.div>

        {lead && leadDims && (
          <motion.button
            type="button"
            ref={(el) => {
              cellRefs.current[leadIndex] = el;
            }}
            onClick={() => openAt(leadIndex)}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="group relative mb-8 block w-full cursor-pointer border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Open photo: ${lead.alt}`}
          >
            <motion.div
              layoutId={reduceMotion ? undefined : lead.image}
              transition={{ duration: 0.5 }}
              className={`overflow-hidden ${leadPortrait ? "mx-auto w-full max-w-[420px] lg:max-w-[480px]" : ""}`}
            >
              <ViewfinderFrame
                captionLeft={`f/${lead.aperture} · ${lead.shutter}s · ISO ${lead.iso}`}
                captionRight={`${String(leadIndex + 1).padStart(2, "0")}/${String(featPhotos.length).padStart(2, "0")}`}
              >
                <Image
                  src={lead.image}
                  alt={lead.alt}
                  width={leadDims.w}
                  height={leadDims.h}
                  priority
                  sizes={leadPortrait ? "(min-width: 1024px) 480px, 100vw" : "(min-width: 1024px) 1100px, 100vw"}
                  className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                />
              </ViewfinderFrame>
            </motion.div>
          </motion.button>
        )}

        <div className="columns-1 [column-gap:6px] md:columns-2 lg:columns-3">
          {featPhotos.map((photo, i) =>
            i === leadIndex ? null : (
              <GalleryCell
                key={photo.image}
                photo={photo}
                index={i}
                onOpen={() => openAt(i)}
                cellRef={(el) => {
                  cellRefs.current[i] = el;
                }}
              />
            ),
          )}
        </div>

        <Lightbox
          photos={featPhotos}
          index={openIndex}
          onClose={close}
          onNavigate={navigateTo}
          returnFocusRef={returnFocusRef}
        />
      </div>
    </LayoutGroup>
  );
}
