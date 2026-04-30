"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import photos from "../data/photos";
import LoadingSpinner from "@/app/lib/components/LoadingSpinner";
import * as motion from "motion/react-m";
import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  SunIcon,
  ClockIcon,
  ViewfinderCircleIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

const FeaturedPhotoLazy = dynamic(() => import("./FeaturedPhoto"));

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function FeaturedGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const preloadedImages = useRef(new Set<string>());

  const preloadImage = useCallback((src: string) => {
    if (preloadedImages.current.has(src)) return;
    preloadedImages.current.add(src);
    // Preload at w=1920 q=80 — matches what Next.js serves for sizes="90vw" on most screens
    const url = `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=80`;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  }, []);

  // Preload prev/next when navigating the lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevIdx = (lightboxIndex - 1 + photos.length) % photos.length;
    const nextIdx = (lightboxIndex + 1) % photos.length;
    [prevIdx, nextIdx].forEach((idx) => {
      const src = photos[idx].image;
      if (typeof src === "string") preloadImage(src);
    });
  }, [lightboxIndex, preloadImage]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i - 1 + photos.length) % photos.length : null,
      ),
    [],
  );
  const next = useCallback(
    () =>
      setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null)),
    [],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, prev, next]);

  return (
    <>
      <div className="relative w-full overflow-hidden flex justify-center items-center">
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full gap-6 px-4 py-6 relative">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                className={`overflow-hidden rounded-lg hover:scale-105 active:scale-105 transition-all duration-200 ease-in-out shadow-lg flex h-full w-full items-center justify-center cursor-pointer ${
                  photo.isBig
                    ? "row-span-2 aspect-2/3"
                    : "row-span-1 aspect-3/2"
                }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                viewport={{ once: false }}
                onMouseEnter={() => {
                  if (typeof photo.image === "string") preloadImage(photo.image);
                }}
                onClick={() => setLightboxIndex(i)}
              >
                <Suspense
                  fallback={
                    <LoadingSpinner className="rounded-lg shadow-lg bg-background w-full h-full" />
                  }
                >
                  <FeaturedPhotoLazy {...photo} i={i} />
                </Suspense>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Photo */}
            <motion.div
              key={lightboxIndex}
              className="relative"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightboxIndex].image}
                alt={photos[lightboxIndex].alt}
                width={0}
                height={0}
                sizes="90vw"
                quality={80}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                }}
                className="block rounded-sm"
              />
              {/* EXIF + caption overlay */}
              <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-10 bg-secondary/70 rounded-xl px-3 py-2.5 shadow-lg backdrop-blur-xs border-2 border-primary/5">
                {photos[lightboxIndex].alt && (
                  <>
                    <span className="text-white/90 text-sm font-ibm leading-tight">
                      {photos[lightboxIndex].alt}
                    </span>
                    <div className="w-full h-px bg-white/10" />
                  </>
                )}
                <div className="flex gap-3">
                  <span className="flex items-center text-white text-[0.65rem] font-mono gap-0.5">
                    <SunIcon className="w-3.5 h-3.5 opacity-70 mb-[1.5px]" />
                    {photos[lightboxIndex].exp}
                  </span>
                  <span className="flex items-center text-white text-[0.65rem] font-mono gap-0.5">
                    <ClockIcon className="w-3.5 h-3.5 opacity-70 mb-[1.5px]" />
                    {photos[lightboxIndex].shutter}
                  </span>
                  <span className="flex items-center text-white text-[0.65rem] font-mono gap-0.5">
                    <ViewfinderCircleIcon className="w-3.5 h-3.5 opacity-70 mb-[1.5px]" />
                    f/{photos[lightboxIndex].aperture}
                  </span>
                  <span className="flex items-center text-white text-[0.65rem] font-mono gap-0.5">
                    <CameraIcon className="w-3.5 h-3.5 opacity-70 mb-[1.5px]" />
                    {photos[lightboxIndex].iso}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Counter */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-ibm tabular-nums">
              {lightboxIndex + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
