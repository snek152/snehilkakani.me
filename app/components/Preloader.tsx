"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const array = [
  "Software Engineer",
  "Full-Stack Developer",
  "Music Producer",
  "Audio Engineer",
  "Graphic Designer",
  "Actor",
];
const spacing = 40;

const Preloader = () => {
  const [text, setText] = useState(array.slice(0, 3));
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setInterval(() => {
      if (animate) {
        setText((prev) => {
          const startIndex = (array.indexOf(prev[0]) + 1) % array.length;
          const newText = [];
          for (let i = 0; i < 3; i++) {
            newText.push(array[(startIndex + i) % array.length]);
          }
          return newText;
        });
      }
    }, 2000);
    return () => clearInterval(timeout);
  }, [animate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white relative">
      <div className="overflow-hidden w-full flex flex-col justify-center h-full absolute">
        <AnimatePresence>
          {text.map((t, index) => (
            <motion.div
              layout
              className={`text-4xl font-normal tracking-tight absolute font-ibm self-center text-center block text-black`}
              initial={{
                y: index === 0 ? -100 : index === 2 ? 100 : 0,
                opacity: index === 1 ? 1 : 0,
              }}
              animate={{
                y: index === 1 ? 0 : index === 0 ? -spacing : spacing,
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
              onAnimationStart={() => setAnimate(true)}
              key={t}
            >
              {t}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Preloader;
