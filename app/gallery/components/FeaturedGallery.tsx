"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import featPhotos from "../photos";

const FeaturedPhoto = lazy(() => import("./FeaturedPhoto"));

const BATCH_SIZE = 6;

const PhotoGallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loadedPhotos, setLoadedPhotos] = useState<typeof featPhotos>([]);

  const [scrolling, setScrolling] = useState(true);

  // Infinite batch loader with looping
  const loadNextBatch = () => {
    const nextIndex = photoIndex + BATCH_SIZE;
    const nextBatch: typeof featPhotos = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const index = (photoIndex + i) % featPhotos.length;
      nextBatch.push(featPhotos[index]);
    }

    setLoadedPhotos((prev) => [...prev, ...nextBatch]);
    setPhotoIndex(nextIndex % featPhotos.length);
  };

  useEffect(() => {
    loadNextBatch();
  }, []);

  // Autoscroll effect
  useEffect(() => {
    let frameId: number;

    const scrollStep = () => {
      if (!scrolling || !galleryRef.current) return;
      galleryRef.current.scrollLeft += 1;
      frameId = requestAnimationFrame(scrollStep);
    };

    if (scrolling) frameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(frameId);
  }, [scrolling]);

  // Scroll listener to trigger next batch
  const handleScroll = () => {
    const el = galleryRef.current;
    if (!el) return;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 300) {
      loadNextBatch();
    }
  };

  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center">
      {/* Scroll Left */}
      <div className="h-full flex justify-center relative items-center z-20 p-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => {
            setScrolling(false);
            galleryRef.current?.scrollBy({ left: -300, behavior: "smooth" });
            setTimeout(() => setScrolling(true), 400);
          }}
          className={`p-2.5 rounded-full cursor-pointer focus:outline-none transition-colors duration-150 ${"bg-primary/75 hover:bg-primary"}`}
        >
          <PlayIcon className="w-5 h-5 rotate-180 text-white" />
        </motion.button>
      </div>

      {/* Gallery */}
      <div
        ref={galleryRef}
        onScroll={handleScroll}
        onMouseEnter={() => setScrolling(false)}
        onMouseLeave={() => setScrolling(true)}
        className="flex overflow-x-auto gap-6 px-4 py-6 scroll-smooth scrollbar-hide lg:grid lg:grid-rows-2 lg:auto-cols-max lg:grid-flow-col"
        style={{
          scrollBehavior: "smooth",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {loadedPhotos.map((photo, i) => (
          <Suspense
            fallback={
              <LoadingSpinner
                className={`${
                  photo.isBig ? "row-span-2 w-[18rem] h-full" : "h-56 w-full"
                } rounded-lg shadow-lg bg-background aspect-[3/2]`}
              />
            }
            key={i + "_" + photo.image}
          >
            <FeaturedPhoto {...photo} />
          </Suspense>
        ))}
      </div>

      {/* Scroll Right */}
      <div className="h-full flex justify-center relative items-center z-20 p-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => {
            setScrolling(false);
            galleryRef.current?.scrollBy({ left: 300, behavior: "smooth" });
            setTimeout(() => setScrolling(true), 400);
          }}
          className={`p-2.5 rounded-full cursor-pointer focus:outline-none transition-colors duration-150 ${"bg-primary/75 hover:bg-primary"}`}
        >
          <PlayIcon className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default PhotoGallery;
