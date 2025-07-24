"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import featPhotos from "../photos";

const FeaturedPhoto = lazy(() => import("./FeaturedPhoto"));
const BATCH_SIZE = 6;
// const MAX_PHOTOS = 10; // Cap visible DOM for performance

export default function PhotoGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<typeof featPhotos>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [scrolling, setScrolling] = useState(true);

  useEffect(() => {
    addPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const el = galleryRef.current;
    if (el) {
      el.scrollLeft = 0; // Reset scroll position on mount
    }
  }, []);

  const addPhotos = () => {
    const newPhotos = Array.from({ length: BATCH_SIZE }).map((_, i) => {
      const index = (photoIndex + i) % featPhotos.length;
      return featPhotos[index];
    });

    setPhotos((prev) => {
      return [...prev, ...newPhotos];
    });

    setPhotoIndex((prev) => (prev + BATCH_SIZE) % featPhotos.length);
  };

  // ⏩ Scroll observer for batching
  const handleScroll = () => {
    const el = galleryRef.current;
    if (!el) return;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 300) {
      addPhotos();
    }
  };

  // 🎞 Smooth autoscroll with proper throttling
  useEffect(() => {
    const el = galleryRef.current;
    if (!el || !scrolling) return;

    let lastTime = performance.now();
    let frameId: number;

    const scrollStep = (now: number) => {
      console.log(now);
      const delta = now - lastTime;
      if (delta >= 10 && scrolling && el) {
        el.scrollLeft += 1;
        lastTime = now;

        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollTo({ left: 0, behavior: "auto" });
        }
      }
      frameId = requestAnimationFrame(scrollStep);
    };

    frameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(frameId);
  }, [scrolling]);

  // 🧭 Scroll control
  const scrollBy = (offset: number) => {
    const el = galleryRef.current;
    if (!el) return;

    setScrolling(false);
    el.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(() => setScrolling(true), 500);
  };

  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center">
      {/* ◀ Left Button */}
      <div className="h-full flex justify-center relative items-center z-20 p-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => scrollBy(-300)}
          className="p-2.5 rounded-full bg-primary/75 hover:bg-primary text-white"
        >
          <PlayIcon className="w-5 h-5 rotate-180" />
        </motion.button>
      </div>

      {/* 📷 Gallery */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute h-full w-6 left-0 top-0 bg-gradient-to-r from-secondary to-transparent pointer-events-none z-20" />
        <div className="absolute h-full w-6 right-0 top-0 bg-gradient-to-l from-secondary to-transparent pointer-events-none z-20" />

        <div
          ref={galleryRef}
          onScroll={handleScroll}
          onMouseEnter={() => setScrolling(false)}
          onMouseLeave={() => setScrolling(true)}
          className="grid grid-rows-2 grid-flow-col auto-cols-max gap-6 px-4 py-6 overflow-x-auto scroll-smooth scrollbar-hide relative"
          style={{
            scrollBehavior: "smooth",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {photos.map((photo, i) => (
            <Suspense
              fallback={
                <LoadingSpinner
                  className={`${
                    photo.isBig
                      ? "row-span-2 !w-[18rem] !h-full"
                      : "!h-56 !w-full"
                  } rounded-lg shadow-lg bg-background aspect-[3/2]`}
                />
              }
              key={`${i}_${photo.image}`}
            >
              <FeaturedPhoto {...photo} />
            </Suspense>
          ))}
        </div>
      </div>

      {/* ▶ Right Button */}
      <div className="h-full flex justify-center relative items-center z-20 p-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => scrollBy(300)}
          className="p-2.5 rounded-full bg-primary/75 hover:bg-primary text-white"
        >
          <PlayIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
