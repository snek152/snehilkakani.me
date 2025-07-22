// /Users/snehilk/Desktop/Coding/new-website/app/gallery/components/PhotoGallery.tsx
"use client";
import { PlayIcon } from "@heroicons/react/24/solid";
import FeaturedPhoto from "./FeaturedPhoto";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const featPhotos: {
  image: string;
  exp: string;
  shutter: string;
  aperture: string;
  iso: number;
  alt: string;
  isBig?: boolean;
}[] = [
  // 2 nonBigs
  {
    image: "/photos/yosemite_bridalveil.jpg",
    exp: "+0.7",
    shutter: "1/1000",
    aperture: "3.2",
    iso: 400,
    alt: "Bridalveil Falls in Yosemite National Park",
    isBig: false,
  },
  {
    image: "/photos/yosemite2.jpg",
    exp: "+0",
    shutter: "1/160",
    aperture: "22",
    iso: 320,
    alt: "A mountain view in Yosemite National Park",
    isBig: false,
  },
  // 1 big
  {
    image: "/photos/ollie.jpg",
    isBig: true,
    exp: "+0.3",
    shutter: "1/60",
    aperture: "5",
    iso: 4000,
    alt: "Picture of my dog Ollie",
  },
  // 2 nonBigs
  {
    image: "/photos/yosemite.jpg",
    exp: "-1.0",
    shutter: "1/2000",
    aperture: "9",
    iso: 500,
    alt: "Yosemite Valley viewpoint",
    isBig: false,
  },
  {
    image: "/photos/firework1.jpg",
    isBig: false,
    exp: "+0",
    shutter: "6.0",
    aperture: "18",
    iso: 1250,
    alt: "Fireworks display during 4th of July celebrations",
  },
  // 1 big
  {
    image: "/photos/firework2.jpg",
    isBig: true,
    exp: "+0",
    shutter: "1/2",
    aperture: "4.8",
    iso: 500,
    alt: "Fireworks display during 4th of July celebrations",
  },
  // 2 nonBigs
  {
    image: "/photos/sunset.jpg",
    isBig: false,
    exp: "+0",
    aperture: "13",
    shutter: "1/125",
    iso: 500,
    alt: "Sunset near my house",
  },
  {
    image: "/photos/yosemite_camp_curry.jpg",
    isBig: false,
    exp: "-0.7",
    shutter: "1/15",
    aperture: "2.8",
    iso: 1600,
    alt: "Camp Curry sign in Curry Village, Yosemite National Park",
  },
  // 1 big
  {
    image: "/photos/tompkins.jpg",
    isBig: true,
    exp: "+0.7",
    shutter: "1/950",
    aperture: "5.6",
    iso: 500,
    alt: "Tompkins Drive in San Jose, California",
  },
  // 2 nonBigs
  {
    image: "/photos/yosemite_meadow.jpg",
    isBig: false,
    exp: "+0.3",
    shutter: "1/1000",
    aperture: "3.8",
    iso: 500,
    alt: "Cook's Meadow in Yosemite National Park",
  },
  {
    image: "/photos/yosemite_road.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/125",
    aperture: "4.5",
    iso: 500,
    alt: "A road in Yosemite National Park",
  },
  // 1 big
  {
    image: "/photos/yosemite_reservoir.jpg",
    isBig: true,
    exp: "+1.0",
    shutter: "1/1250",
    aperture: "6.4",
    iso: 500,
    alt: "A reservoir near Yosemite National Park",
  },
  // 2 nonBigs
  {
    image: "/photos/yosemite_v_falls.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/1500",
    aperture: "7.1",
    iso: 640,
    alt: "An overhead view of Vernal Falls in Yosemite National Park",
  },
  // 1 big
  {
    image: "/photos/yosemite_sunset.jpg",
    isBig: true,
    exp: "-1.0",
    shutter: "1/125",
    aperture: "11",
    iso: 1250,
    alt: "Glacier Point in Yosemite National Park",
  },
];

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
        {featPhotos.map((p, i) => {
          const isBig = p.isBig;
          return (
            <motion.div
              key={i}
              className={`overflow-hidden rounded-lg shadow-lg flex items-center justify-center ${
                isBig ? "row-span-2" : "row-span-1"
              }`}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FeaturedPhoto {...p} />
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
