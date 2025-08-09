"use client";
// import { Dialog, DialogPanel } from "@headlessui/react";
// import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";
import Image from "next/image";
import musicprod from "@/public/music_prod.jpg";
import photography from "@/public/photography.jpeg";
// import blessings from "@/public/blessings.png";
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
  // {
  //   src: blessings,
  //   caption: "Hosting a recording studio session",
  // },
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
    <div className="lg:max-h-screen w-full px-4 lg:px-4 pt-2 pb-5 lg:py-20">
      <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-2 grid-rows-2 gap-6 h-full">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
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
                placeholder="blur"
                src={photo.src}
                alt={photo.caption}
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-secondary/20 group-active:bg-secondary/20 transition-colors duration-300" />
            {/* <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full p-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div> */}
            <div
              className="absolute bottom-2 left-2 right-2 bg-secondary/70 backdrop-blur-xs rounded-xl px-3 py-2 shadow-lg border-2 border-primary/5 group-hover:opacity-100 group-active:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{
              //   duration: 0.4,
              //   delay: idx * 0.1 + 0.3,
              //   ease: [0.25, 0.46, 0.45, 0.94],
              // }}
              // whileHover={{
              //   y: -2,
              //   transition: { duration: 0.2 },
              // }}
            >
              <p className="text-surface text-sm font-ibm">{photo.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* <AnimatePresence>
        {selected !== null && (
          <Dialog
            open
            onClose={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              className="fixed inset-0 bg-black/70"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <DialogPanel
              as={motion.div}
              layoutId={`photo-wrapper-${selected}`}
              className="relative z-50 bg-white rounded-xl shadow-xl overflow-hidden w-[90vw] max-w-3xl"
            >
              <div className="aspect-[3/4] w-full">
                <motion.div
                  layoutId={`photo-img-${selected}`}
                  className="w-full h-full bg-cover bg-center aspect-[4/3] will-change-transform"
                  style={{
                    backgroundImage: `url(${photos[selected].src})`,
                  }}
                />
              </div>
              <motion.div
                className="p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <p className="text-lg font-semibold">
                  {photos[selected].caption}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </motion.div>
            </DialogPanel>
          </Dialog>
        )}
      </AnimatePresence> */}
    </div>
  );
}
