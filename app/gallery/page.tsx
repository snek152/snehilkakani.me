"use client";

import { useCallback, useRef, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { fadeUp } from "@/app/lib/motion";
import GalleryCell from "@/app/lib/components/gallery/GalleryCell";
import Lightbox from "@/app/lib/components/gallery/Lightbox";

export default function GalleryPage() {
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

  return (
    <LayoutGroup>
      <div className="px-6 pt-[4.5rem] pb-20 sm:px-8 lg:px-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-9">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] text-fg">
            Lens
          </h1>
          <p className="mt-1.5 text-sm text-dim2">Sony α6000 · {featPhotos.length} photos</p>
        </motion.div>

        <div className="columns-1 [column-gap:6px] md:columns-2 lg:columns-3">
          {featPhotos.map((photo, i) => (
            <GalleryCell
              key={photo.image}
              photo={photo}
              index={i}
              onOpen={() => openAt(i)}
              cellRef={(el) => {
                cellRefs.current[i] = el;
              }}
            />
          ))}
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
