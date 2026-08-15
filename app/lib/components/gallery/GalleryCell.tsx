"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type featPhotos from "@/app/lib/data/photos";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import Exposure from "./Exposure";

export type Photo = (typeof featPhotos)[number];

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
  const reduceMotion = useMotionPreference();

  return (
    <figure style={{ width: `${width}px` }} className="group m-0 shrink-0">
      <motion.div
        initial={
          reduceMotion || index === 0
            ? false
            : { clipPath: "inset(0% 100% 0% 0%)", scale: 1.02 }
        }
        animate={reduceMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
        transition={{
          duration: beats(0.6),
          delay: Math.min(index * beats(0.06), beats(0.5)),
          ease: EASE_OUT,
        }}
      >

        <button
        ref={cellRef}
        type="button"
        onClick={onOpen}
        style={{ height: `${height}px` }}
        className="block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 transition-transform duration-[120ms] ease-[var(--ease-press)] active:scale-[0.99] active:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`Open ${photo.alt}`}
      >
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
        </button>
      </motion.div>

      <figcaption className="mt-3 border-t border-border pt-2">
        <span
          className={`block text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] font-medium leading-snug text-dim group-hover:text-fg group-has-[button:focus-visible]:text-fg ${
            reduceMotion ? "" : "transition-colors duration-150"
          }`}
        >
          {photo.alt}
        </span>
        <Exposure photo={photo} className="mt-1.5" />
      </figcaption>
    </figure>
  );
}
