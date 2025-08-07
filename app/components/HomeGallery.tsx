"use client";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    caption: "Mountain View",
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800",
    caption: "Forest Path",
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
    caption: "Desert Dunes",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    caption: "City Skyline",
  },
];

export default function HomeGallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            layoutId={`photo-wrapper-${idx}`}
            onClick={() => setSelected(idx)}
            className={`rounded-xl shadow-lg bg-white cursor-pointer overflow-hidden ${
              selected === idx ? "invisible" : "visible"
            }`}
          >
            <div className="aspect-[4/3] w-full">
              <motion.img
                src={photo.src}
                alt={photo.caption}
                className="object-cover w-full h-full"
                layoutId={`photo-img-${idx}`}
              />
            </div>
            <div className="p-4 text-center">
              <p className="text-gray-800 font-medium">{photo.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <Dialog
            open
            onClose={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/70"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* PANEL */}
            <DialogPanel
              as={motion.div}
              layoutId={`photo-wrapper-${selected}`}
              className="relative z-50 bg-white rounded-xl shadow-xl overflow-hidden w-[90vw] max-w-3xl"
            >
              <div className="aspect-[4/3] w-full">
                <motion.img
                  src={photos[selected].src}
                  alt={photos[selected].caption}
                  className="object-cover w-full h-full"
                  layoutId={`photo-img-${selected}`}
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
      </AnimatePresence>
    </div>
  );
}
