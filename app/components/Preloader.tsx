"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const array = [
  "Software Engineer",
  "Full-Stack Developer",
  "Music Producer",
  "Audio Engineer",
  "Graphic Designer",
  "Actor",
];

const Preloader = () => {
  const [text, setText] = useState(array.slice(0, 3));

  useEffect(() => {
    const timeout = setInterval(() => {
      setText((prev) => {
        const startIndex = (array.indexOf(prev[0]) + 1) % array.length;
        const newText = [];
        for (let i = 0; i < 3; i++) {
          newText.push(array[(startIndex + i) % array.length]);
        }
        return newText;
      });
    }, 2000);
    return () => clearInterval(timeout);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen overflow-hidden relative">
      <AnimatePresence>
        {text.map((t, index) => (
          <motion.div
            layout
            className={`text-2xl font-ibm text-center block ${
              index === 1 ? "text-black" : "text-gray-400"
            }`}
            initial={{
              y: index === 0 ? -100 : index === 2 ? 100 : 0,
              opacity: index === 1 ? 1 : 0,
            }}
            animate={{
              y: 0,
              opacity: index === 1 ? 1 : 0.5,
            }}
            exit={{
              y: index === 0 ? -100 : 100,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              duration: 0.5,
            }}
            key={t}
          >
            {t}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Preloader;
