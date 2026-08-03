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
 * No hover zoom. Hover/focus only fades in the ViewfinderFrame's corner
 * ticks and lifts the caption title from dim to full weight.
 */
export default function GalleryCell({
  photo,
  index,
  width,
  height,
  shared,
  onOpen,
  cellRef,
}: {
  photo: Photo;
  index: number;
  width: number;
  height: number;
  /** True when this plate shares its row with others, so its title box
   * has to hold a fixed two lines to stay level with theirs. */
  shared: boolean;
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

      {/* A plate sharing a row reserves two title lines, wrapped or not:
        * a narrow portrait beside a wide landscape would otherwise
        * either shed half its title to an ellipsis or push its own
        * exposure line out of step with the rest of the row. A plate
        * that owns its row is wide enough to need neither. */}
      <figcaption className="mt-3 border-t border-border pt-2">
        <span
          className={`block text-[0.8125rem] leading-snug ${
            shared ? "line-clamp-2 h-[2.25rem]" : "truncate"
          } ${reduceMotion ? "" : "transition-colors duration-150"} ${active ? "text-fg" : "text-dim"}`}
        >
          {photo.alt}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[0.6875rem] tracking-[0.02em] tabular-nums text-dim2">
          f/{photo.aperture} · {photo.shutter}s · ISO {photo.iso}
        </span>
      </figcaption>
    </motion.figure>
  );
}
