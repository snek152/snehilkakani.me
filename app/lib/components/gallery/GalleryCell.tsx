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
 * One editorial plate: a frame and the caption that belongs to it, as a
 * single unit. The image box is sized in exact pixels by the justified
 * grid's row packing (not CSS columns or an aspect-ratio guess), so it
 * is always its true aspect ratio; the caption sits directly beneath it,
 * ruled to exactly the frame's width, so the exposure it describes is
 * unambiguous without a legend, an overlay, or a hover.
 *
 * No hover zoom. Hover/focus only snaps in the ViewfinderFrame's corner
 * ticks and lifts the caption title from dim to full weight.
 */
export default function GalleryCell({
  photo,
  index,
  width,
  height,
  onOpen,
  cellRef,
}: {
  photo: Photo;
  index: number;
  width: number;
  height: number;
  onOpen: () => void;
  cellRef: (el: HTMLButtonElement | null) => void;
}) {
  const [active, setActive] = useState(false);
  const reduceMotion = useMotionPreference();

  return (
    <motion.figure
      style={{ width: `${width}px` }}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
      transition={{ duration: beats(0.6), delay: (index % 6) * beats(0.05), ease: EASE_OUT }}
      className="m-0 shrink-0"
    >
      <button
        ref={cellRef}
        type="button"
        onClick={onOpen}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        style={{ height: `${height}px` }}
        className="block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`Open ${photo.alt}`}
      >
        <ViewfinderFrame active={active} animate={!reduceMotion} className="h-full w-full">
          <Image
            src={photo.image}
            alt=""
            width={Math.round(width)}
            height={Math.round(height)}
            priority={index < 4}
            loading={index < 4 ? undefined : "lazy"}
            sizes={`${Math.ceil(width)}px`}
            className="block h-full w-full object-cover"
          />
        </ViewfinderFrame>
      </button>

      {/* Title and exposure are one caption block, not two scraps: the
        * title carries it, and the exposure sits tight beneath in the
        * site's smallest metadata tier — sans, like every other figure
        * on the site, and tabular so the f-stops, shutter speeds and ISOs
        * line up as a column down the grid. It was the only mono on the
        * site, which made an exposure look like a build artifact rather
        * than part of the caption.
        *
        * Caption heights are free to differ across a row. Padding every
        * title out to a fixed two lines did keep the exposure baselines
        * level, but at the price of a 22px hole under every one-line
        * title — and a short caption beside a wrapped one is ordinary
        * editorial behaviour, not a defect worth that. */}
      <figcaption className="mt-3 border-t border-border pt-2">
        <span
          className={`block text-sm font-medium leading-snug ${
            reduceMotion ? "" : "transition-colors duration-150"
          } ${active ? "text-fg" : "text-dim"}`}
        >
          {photo.alt}
        </span>
        <span className="mt-1 block truncate text-xs tabular-nums text-dim2">
          f/{photo.aperture} · {photo.shutter}s · ISO {photo.iso}
        </span>
      </figcaption>
    </motion.figure>
  );
}
