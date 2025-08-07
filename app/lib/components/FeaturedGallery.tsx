"use client";
import { Suspense } from "react";
import photos from "../data/photos";
import LoadingSpinner from "@/app/lib/components/LoadingSpinner";
// import FeaturedPhoto from "./FeaturedPhoto";
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
              className={`overflow-hidden rounded-lg shadow-lg flex h-full w-full items-center justify-center ${
                photo.isBig
                  ? "row-span-2 aspect-[2/3]"
                  : "row-span-1 aspect-[3/2]"
              }`}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              //   exit={{ opacity: 0, y: 0 }}
              viewport={{ once: false, amount: 0.02 }}
            >
              <Suspense
                fallback={
                  <LoadingSpinner
                    className={`rounded-lg shadow-lg bg-background w-full h-full`}
                  />
                }
              >
                {/* <LoadingSpinner
                  className={`rounded-lg shadow-lg bg-background w-full h-full`}
                /> */}
                <FeaturedPhotoLazy {...photo} i={i} />
              </Suspense>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
