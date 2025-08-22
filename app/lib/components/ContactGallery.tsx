"use client";

import * as motion from "motion/react-m";
import Image from "next/image";
import musicprod from "@/public/music_prod.jpg";
import photography from "@/public/photography.jpeg";
import lenaea from "@/public/lenaea.jpg";
import webdev from "@/public/webdev.jpg";

const photos = [
  {
    src: musicprod,
    caption: "Putting together a new beat",
  },
  {
    src: photography,
    caption: "Prepping my camera for a shoot in NYC",
  },
  {
    src: webdev,
    caption: "Presenting about Git at Web Dev club",
  },
  {
    src: lenaea,
    caption: "Performing onstage at a theatre festival",
  },
];

export default function ContactGallery() {
  return (
    <div className="lg:max-h-screen w-full px-4 lg:px-4 pt-2 pb-5 lg:py-20 [content-visibility:auto] [contain-intrinsic-size:800px]">
      <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-2 grid-rows-2 gap-6 h-full">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 0, filter: "blur(3px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: idx * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="rounded-xl shadow-lg group hover:rotate-1 hover:scale-105 active:rotate-1 active:scale-105 transition-all duration-300 h-full w-full relative overflow-hidden"
          >
            <div className="w-full h-full relative">
              <Image
                className="w-full h-full object-cover object-center will-change-transform"
                quality={70}
                placeholder="blur"
                src={photo.src}
                alt={photo.caption}
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-secondary/20 group-active:bg-secondary/20 transition-colors duration-300" />
            <div className="absolute bottom-2 left-2 right-2 bg-secondary/70 backdrop-blur-xs rounded-xl px-3 py-2 shadow-lg border-2 border-primary/5 group-hover:opacity-100 group-active:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out">
              <p className="text-surface text-sm font-ibm">{photo.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
