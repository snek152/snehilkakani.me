"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type featPhotos from "@/app/lib/data/photos";
import { getPhotoDims } from "./photo-dims";
import { EASE_OUT, EASE_INOUT } from "@/app/lib/motion";

export type Photo = (typeof featPhotos)[number];

export default function GalleryCell({
  photo,
  index,
  onOpen,
  cellRef,
}: {
  photo: Photo;
  index: number;
  onOpen: () => void;
  cellRef: (el: HTMLButtonElement | null) => void;
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const { w, h } = getPhotoDims(photo.image);
  const showCaption = hover || focused;
  const [captionReady, setCaptionReady] = useState(false);

  useEffect(() => {
    if (!showCaption) {
      setCaptionReady(false);
      return;
    }
    const timer = window.setTimeout(() => setCaptionReady(true), 260);
    return () => window.clearTimeout(timer);
  }, [showCaption]);

  return (
    <motion.button
      ref={cellRef}
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      initial={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.34, delay: (index % 3) * 0.045, ease: EASE_OUT }}
      className="group relative mb-[6px] block w-full cursor-pointer overflow-hidden break-inside-avoid border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Open photo: ${photo.alt}`}
    >
      <motion.div
        layoutId={reduceMotion ? undefined : photo.image}
        transition={{ duration: 0.5, ease: EASE_INOUT }}
        className="overflow-hidden"
      >
        <motion.div
          animate={reduceMotion ? undefined : { scale: showCaption ? 1.018 : 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <Image
            src={photo.image}
            alt={photo.alt}
            width={w}
            height={h}
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="block h-auto w-full"
          />
        </motion.div>
      </motion.div>
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          opacity: reduceMotion ? 0 : showCaption ? 1 : 0,
          scale: showCaption ? 1 : 0.96,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-2 border border-white/55"
      />
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: captionReady ? 1 : 0, y: captionReady ? 0 : 6 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-bg/90 px-2 py-[0.45rem]"
      >
        <span className="text-sm tabular-nums" style={{ color: "rgba(200,215,255,0.72)" }}>
          f/{photo.aperture} · {photo.shutter}s · ISO {photo.iso}
        </span>
      </motion.div>
    </motion.button>
  );
}
