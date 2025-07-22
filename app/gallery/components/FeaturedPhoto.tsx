"use client";
import {
  CameraIcon,
  ClockIcon,
  SunIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";

export default function FeaturedPhoto({
  image,
  exp,
  shutter,
  aperture,
  iso,
  alt,
  isBig,
}: {
  image: StaticImageData | string;
  exp: string;
  shutter: string;
  aperture: string;
  iso: number;
  alt: string;
  isBig?: boolean;
}) {
  return (
    <div
      className={
        "relative " +
        (isBig ? "w-[18rem] h-full aspect-[3/2]" : "h-56 w-full aspect-[3/2]") // Changed w-full to w-64 for non-big
      }
    >
      <Image
        src={image}
        alt={alt}
        width={600}
        height={600}
        className="object-cover object-center h-full w-full"
        priority
      />
      {/* <motion.div
                    className="absolute top-4 left-4 z-20 bg-on-surface/70 rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm flex flex-col items-start"
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                      delay: 0.5,
                    }}
                  >
                    <span className="text-3xl font-semibold text-surface font-domine leading-tight">
                      Snehil Kakani
                    </span>
                    <span className="text-xs text-surface/80 font-ibm mt-0.5">
                      Software Engineer & Creator
                    </span>
                  </motion.div> */}
      {/* Camera settings bottom-left overlay */}
      <motion.div
        className="absolute bottom-4 left-4 flex gap-2 z-10 bg-on-surface/60 rounded-lg px-3 py-2 shadow-lg backdrop-blur-xs"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 14,
          delay: 0.7,
        }}
      >
        {/* Exposure */}
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85, duration: 0.3 }}
        >
          <SunIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          {exp}
        </motion.span>
        {/* Shutter Speed */}
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.95, duration: 0.3 }}
        >
          <ClockIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          {shutter}
        </motion.span>
        {/* Aperture */}
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.05, duration: 0.3 }}
        >
          <ViewfinderCircleIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          f/{aperture}
        </motion.span>
        {/* ISO */}
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.15, duration: 0.3 }}
        >
          <CameraIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          {iso}
        </motion.span>
      </motion.div>
    </div>
  );
}
