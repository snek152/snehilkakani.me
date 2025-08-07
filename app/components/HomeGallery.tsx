"use client";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";

const photos = [
  {
    src: "/music_prod.jpg",
    caption: "Mountain View",
  },
  {
    src: "/photography.jpeg",
    caption: "Forest Path",
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
            className={`rounded-xl shadow-lg cursor-pointer overflow-hidden ${
              selected === idx ? "invisible" : "visible"
            }`}
          >
            <div className="aspect-[4/3] w-full">
              <motion.div
                layoutId={`photo-img-${idx}`}
                className="w-full h-full bg-cover bg-center will-change-transform"
                style={{
                  backgroundImage: `url(${photo.src})`,
                }}
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
      </AnimatePresence>
    </div>
  );
}
