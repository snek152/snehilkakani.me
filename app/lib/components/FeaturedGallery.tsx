"use client";

import { Suspense } from "react";
import photos from "../data/photos";
import LoadingSpinner from "@/app/lib/components/LoadingSpinner";
import * as motion from "motion/react-m";
import dynamic from "next/dynamic";

const FeaturedPhotoLazy = dynamic(() => import("./FeaturedPhoto"));

export default function FeaturedGallery() {
  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center">
      <div className="relative w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full gap-6 px-4 py-6 relative">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className={`overflow-hidden rounded-lg hover:scale-105 active:scale-105 transition-all duration-200 ease-in-out shadow-lg flex h-full w-full items-center justify-center ${
                photo.isBig
                  ? "row-span-2 aspect-[2/3]"
                  : "row-span-1 aspect-[3/2]"
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: false }}
            >
              <Suspense
                fallback={
                  <LoadingSpinner
                    className={`rounded-lg shadow-lg bg-background w-full h-full`}
                  />
                }
              >
                <FeaturedPhotoLazy {...photo} i={i} />
              </Suspense>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
