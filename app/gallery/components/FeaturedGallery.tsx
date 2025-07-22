"use client";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { PlayIcon } from "@heroicons/react/24/solid";
// import FeaturedPhoto from "./FeaturedPhoto";
import { motion } from "motion/react";
import { useEffect, useRef, useState, lazy, Suspense } from "react";

const FeaturedPhoto = lazy(() => import("./FeaturedPhoto"));

const featPhotos: {
  image: string;
  exp: string;
  shutter: string;
  aperture: string;
  iso: number;
  alt: string;
  isBig?: boolean;
}[] = [
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
    image: "/photos/cloudy_sunset.jpg",
    exp: "+0",
    iso: 100,
    shutter: "1/40",
    aperture: "5.6",
    alt: "A cloudy sunset near my house",
    isBig: false,
  },
  {
    image: "/photos/ollie.jpg",
    isBig: true,
    exp: "+0.3",
    shutter: "1/60",
    aperture: "5",
    iso: 4000,
    alt: "Picture of my dog Ollie",
  },
  {
    image: "/photos/yosemite.jpg",
    exp: "-1.0",
    shutter: "1/2000",
    aperture: "9",
    iso: 500,
    alt: "Yosemite Valley viewpoint",
    isBig: false,
  },
  // {
  //   image: "/photos/firework1.jpg",
  //   isBig: false,
  //   exp: "+0",
  //   shutter: "6.0",
  //   aperture: "18",
  //   iso: 1250,
  //   alt: "Fireworks display during 4th of July celebrations",
  // },
  {
    image: "/photos/decs.jpg",
    exp: "+0",
    shutter: "1/60",
    aperture: "3.5",
    iso: 400,
    alt: "Homecoming decorations meeting",
    isBig: false,
  },
  {
    image: "/photos/ny_rc.jpg",
    exp: "+0",
    shutter: "1/40",
    aperture: "4",
    iso: 1600,
    alt: "The Radio City Music Hall in New York City",
    isBig: true,
  },
  // {
  //   image: "/photos/yosemite2.jpg",
  //   exp: "+0",
  //   shutter: "1/160",
  //   aperture: "22",
  //   iso: 320,
  //   alt: "A mountain view in Yosemite National Park",
  //   isBig: false,
  // },
  {
    image: "/photos/grad_party.jpg",
    exp: "0",
    shutter: "1/60",
    aperture: "4",
    iso: 400,
    alt: "Yearbooks and grad caps at a graduation party with friends",
    isBig: false,
  },
  {
    image: "/photos/ny_stop.jpg",
    exp: "+0",
    shutter: "1/80",
    aperture: "3.5",
    iso: 100,
    isBig: false,
    alt: "A pedestrian stop sign in New York City",
  },

  {
    image: "/photos/firework2.jpg",
    isBig: true,
    exp: "+0",
    shutter: "1/2",
    aperture: "4.8",
    iso: 500,
    alt: "Fireworks display during 4th of July celebrations",
  },
  // {
  //   image: "/photos/sunset.jpg",
  //   isBig: false,
  //   exp: "+0",
  //   aperture: "13",
  //   shutter: "1/125",
  //   iso: 500,
  //   alt: "Sunset near my house",
  // },
  {
    image: "/photos/grill.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/60",
    aperture: "4",
    iso: 400,
    alt: "A cookout in the park with burgers and hot dogs",
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
  {
    image: "/photos/vinyl_player.jpg",
    isBig: true,
    exp: "+0",
    shutter: "1/60",
    aperture: "4",
    iso: 400,
    alt: "A vinyl player with a record playing",
  },
  {
    image: "/photos/improv.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/640",
    aperture: "4",
    iso: 100,
    alt: "Improv team practicing in the local park",
  },
  {
    image: "/photos/ny_fountain.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/800",
    aperture: "3.5",
    iso: 100,
    alt: "A fountain in Washington Square Park, New York City",
  },
  {
    image: "/photos/tompkins.jpg",
    isBig: true,
    exp: "+0.7",
    shutter: "1/950",
    aperture: "5.6",
    iso: 500,
    alt: "Tompkins Drive in San Jose, California",
  },
  {
    image: "/photos/ny_flag.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/6",
    aperture: "3.5",
    iso: 400,
    alt: "A flag in New York City",
  },
  {
    image: "/photos/yosemite_meadow.jpg",
    isBig: false,
    exp: "+0.3",
    shutter: "1/1000",
    aperture: "3.8",
    iso: 500,
    alt: "Cook's Meadow in Yosemite National Park",
  },
  // {
  //   image: "/photos/yosemite_reservoir.jpg",
  //   isBig: true,
  //   exp: "+1.0",
  //   shutter: "1/1250",
  //   aperture: "6.4",
  //   iso: 500,
  //   alt: "A reservoir near Yosemite National Park",
  // },
  {
    image: "/photos/ny_bridge.jpg",
    isBig: true,
    exp: "+0",
    shutter: "1/200",
    aperture: "8",
    iso: 100,
    alt: "Manhattan Bridge in New York City",
  },
  // {
  //   image: "/photos/yosemite_v_falls.jpg",
  //   isBig: false,
  //   exp: "+0",
  //   shutter: "1/1500",
  //   aperture: "7.1",
  //   iso: 640,
  //   alt: "An overhead view of Vernal Falls in Yosemite National Park",
  // },
  {
    image: "/photos/ny_deer.jpg",
    isBig: false,
    exp: "+0",
    shutter: "1/200",
    aperture: "4.5",
    iso: 100,
    alt: "A deer in the Bronx Zoo, New York City",
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
          // const isBig = p.isBig;
          return (
            <Suspense
              fallback={
                <LoadingSpinner
                  className={`${p.isBig ? "row-span-2" : "row-span-1"}`}
                />
              }
              key={i}
            >
              <FeaturedPhoto {...p} key={i} />
            </Suspense>
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
