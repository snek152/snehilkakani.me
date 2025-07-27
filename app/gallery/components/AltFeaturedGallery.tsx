"use client";
import { Suspense } from "react";
import photos from "../photos";
import LoadingSpinner from "@/app/components/LoadingSpinner";
// import FeaturedPhoto from "./FeaturedPhoto";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const FeaturedPhotoLazy = dynamic(() => import("./FeaturedPhoto"));

export default function FeaturedGallery() {
  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center">
      <div className="relative w-full overflow-hidden">
        <div className="grid grid-cols-3 h-full gap-6 px-4 py-6 relative">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              //   exit={{ opacity: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Suspense
                fallback={
                  <LoadingSpinner
                    className={`rounded-lg shadow-lg bg-background w-full h-full`}
                  />
                }
              >
                <FeaturedPhotoLazy {...photo} />
              </Suspense>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
