"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type featPhotos from "@/app/lib/data/photos";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { lightboxSizesFor } from "./photo-dims";
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
  const [hovered, setHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [warm, setWarm] = useState(false);
  const active = hovered || pressed || keyboardFocused;
  const startWarm = () => setWarm(true);
  return (
    <figure style={{ width: `${width}px` }} className="group m-0 shrink-0">
      <motion.div
        className="relative"
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
        onMouseEnter={() => {
          setHovered(true);
          startWarm();
        }}
        onMouseLeave={() => setHovered(false)}
        className="peer relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onPointerDown={() => {
          setPressed(true);
          startWarm();
        }}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onFocus={(event) => {
          const visible = event.currentTarget.matches(":focus-visible");
          setKeyboardFocused(visible);
          if (visible) startWarm();
        }}
        onBlur={() => setKeyboardFocused(false)}
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
        {warm && (
          <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
            <Image
              src={photo.image}
              alt=""
              width={Math.round(width)}
              height={Math.round(height)}
              sizes={lightboxSizesFor(photo.image)}
              loading="eager"
            />
          </div>
        )}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
          animate={{ opacity: active ? 1 : 0, scaleX: active ? 1 : 0.35 }}
          transition={{ duration: reduceMotion ? 0 : beats(0.25), ease: EASE_OUT }}
        />
      </motion.div>

      <figcaption className="mt-2">
        <Exposure photo={photo} />
      </figcaption>
    </figure>
  );
}
