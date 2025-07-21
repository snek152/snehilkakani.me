// /Users/snehilk/Desktop/Coding/new-website/app/gallery/components/PhotoGallery.tsx
"use client";
import { PlayIcon } from "@heroicons/react/24/solid";
import FeaturedPhoto from "./FeaturedPhoto";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function PhotoGallery() {
  const galleryRowRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    if (!isScrolling || !galleryRowRef.current) return;

    let animationFrame: number;

    const scrollStep = () => {
      if (!isScrolling || !galleryRowRef.current) return;
      galleryRowRef.current.scrollLeft += 1;
      animationFrame = requestAnimationFrame(scrollStep);
    };

    animationFrame = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrame);
  }, [isScrolling]);

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center">
      {/* Scroll Buttons */}
      <div className="h-full flex justify-center relative items-center z-20 p-2">
        {/* <button
          className="bg-white/80 rounded-full p-2 shadow hover:bg-white"
          onClick={() => {
            setIsScrolling(false);
            if (galleryRowRef.current) {
              galleryRowRef.current.scrollBy({
                left: -300,
                behavior: "smooth",
              });
              setTimeout(() => setIsScrolling(true), 400);
            }
          }}
          aria-label="Scroll Left"
        >
          ◀
        </button> */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => {
            setIsScrolling(false);
            if (galleryRowRef.current) {
              galleryRowRef.current.scrollBy({
                left: -300,
                behavior: "smooth",
              });
              setTimeout(() => setIsScrolling(true), 400);
            }
          }}
          className={`p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-150 ${"bg-primary/75 hover:bg-primary"}`}
        >
          <span>
            <PlayIcon className="w-5 h-10 rotate-180 text-white" />
          </span>
        </motion.button>
      </div>

      {/* Gallery Row */}
      <div
        ref={galleryRowRef}
        className="grid grid-rows-2 grid-flow-col auto-cols-max gap-6 p-6 overflow-x-auto scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        onMouseEnter={() => setIsScrolling(false)}
        onMouseLeave={() => setIsScrolling(true)}
        role="region"
      >
        {[...Array(40)].map((_, i) => {
          const isBig = true;
          return (
            <motion.div
              key={i}
              className={`overflow-hidden rounded-lg shadow-lg bg-gray-100 flex items-center justify-center ${
                isBig ? "row-span-2" : "row-span-1"
              }`}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FeaturedPhoto
                image={`/about.jpg`}
                exp={`+2`}
                shutter={`1/2`}
                aperture="2.8"
                iso={1600}
                alt="Gallery photo"
              />
            </motion.div>
          );
        })}
      </div>
      <div className="h-full flex justify-center items-center z-20 p-2">
        {/* <button
          className="bg-white/80 rounded-full p-2 shadow hover:bg-white"
          onClick={() => {
            setIsScrolling(false);
            if (galleryRowRef.current) {
              galleryRowRef.current.scrollBy({ left: 300, behavior: "smooth" });
              setTimeout(() => setIsScrolling(true), 400);
            }
          }}
          aria-label="Scroll Right"
        >
          ▶
        </button> */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => {
            setIsScrolling(false);
            if (galleryRowRef.current) {
              galleryRowRef.current.scrollBy({
                left: 300,
                behavior: "smooth",
              });
              setTimeout(() => setIsScrolling(true), 400);
            }
          }}
          className={`p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-150 ${"bg-primary/75 hover:bg-primary"}`}
        >
          <span>
            <PlayIcon className="w-5 h-10 rotate-0 text-white" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
