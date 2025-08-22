"use client";
import {
  CameraIcon,
  ClockIcon,
  SunIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import * as motion from "motion/react-m";
import Image, { StaticImageData } from "next/image";

export default function FeaturedPhoto({
  image,
  exp,
  shutter,
  aperture,
  iso,
  alt,
  i,
}: // isBig,
{
  image: StaticImageData | string;
  exp: string;
  shutter: string;
  aperture: string;
  iso: number;
  alt: string;
  i: number;
}) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
        quality={80}
        placeholder="empty"
        className="object-cover object-center h-full w-full"
        priority={i < 3}
      />
      <motion.div
        className="absolute bottom-2 left-2 flex gap-2 z-10 bg-secondary/70 rounded-xl px-3 py-2 shadow-lg backdrop-blur-xs border-2 border-primary/5"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 14,
          delay: 0.7,
        }}
      >
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.85, duration: 0.3 }}
        >
          <SunIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          {exp}
        </motion.span>
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.95, duration: 0.3 }}
        >
          <ClockIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          {shutter}
        </motion.span>
        <motion.span
          className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.05, duration: 0.3 }}
        >
          <ViewfinderCircleIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
          f/{aperture}
        </motion.span>
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
