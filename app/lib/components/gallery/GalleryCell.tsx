"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type featPhotos from "@/app/lib/data/photos";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";

export type Photo = (typeof featPhotos)[number];

/**
 * A single contact-sheet frame. Sized in exact pixels by the justified
 * grid's row packing (not by CSS columns or an aspect-ratio guess), so
 * its box is always its true aspect ratio. No hover zoom, no scale — the
 * only hover/focus feedback is the ViewfinderFrame's corner ticks
 * fading in, and lifting this frame's EXIF up to the page's margin
 * column via `onExifChange` rather than overlaying it on the photo.
 */
export default function GalleryCell({
  photo,
  index,
  total,
  width,
  height,
  onOpen,
  onExifChange,
  cellRef,
}: {
  photo: Photo;
  index: number;
  total: number;
  width: number;
  height: number;
  onOpen: () => void;
  onExifChange: (index: number | null) => void;
  cellRef: (el: HTMLButtonElement | null) => void;
}) {
  const [active, setActive] = useState(false);
  const reduceMotion = useMotionPreference();

  const activate = () => {
    setActive(true);
    onExifChange(index);
  };
  const deactivate = () => {
    setActive(false);
    onExifChange(null);
  };

  return (
    <motion.button
      ref={cellRef}
      type="button"
      onClick={onOpen}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      style={{ width: `${width}px`, height: `${height}px` }}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
      transition={{ duration: beats(0.6), delay: (index % 6) * beats(0.05), ease: EASE_OUT }}
      className="group relative block shrink-0 cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Open photo ${index + 1} of ${total}: ${photo.alt}, f/${photo.aperture}, ${photo.shutter}s, ISO ${photo.iso}`}
    >
      <ViewfinderFrame active={active} animate={!reduceMotion} className="h-full w-full">
        <Image
          src={photo.image}
          alt={photo.alt}
          width={Math.round(width)}
          height={Math.round(height)}
          priority={index < 4}
          loading={index < 4 ? undefined : "lazy"}
          sizes={`${Math.ceil(width)}px`}
          className="block h-full w-full object-cover"
        />
      </ViewfinderFrame>
    </motion.button>
  );
}
