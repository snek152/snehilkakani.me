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
const spacing = 40;

const HomePage = () => {
  const [text, setText] = useState(array.slice(0, 3));
  const [animate, setAnimate] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflowY = "auto";
      setLoaded(true);
    }, 3000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="w-[100vw] h-screen flex items-center justify-center bg-white relative
          md:w-[100vw] md:h-screen
          lg:w-[50vw] lg:h-screen"
        animate={{
          width: loaded
            ? window.innerWidth >= 1024
              ? "50vw"
              : "100vw"
            : "100vw",
          height: loaded
            ? window.innerWidth >= 1024
              ? "100vh"
              : "50vh"
            : "100vh",
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
      >
        <div className="overflow-hidden w-full flex flex-col justify-center h-full absolute">
          <AnimatePresence>
            {text.map((t, index) => (
              <motion.div
                layout
                className={`text-4xl font-normal tracking-tight absolute font-ibm self-center text-center block text-black
          md:text-4xl
          lg:text-4xl`}
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
      </motion.div>
      <div className="w-100vw lg:w-[50vw] h-[50vh] lg:h-screen flex items-center justify-center bottom-0 left-0 lg:right-0 lg:top-0 absolute">
        <AnimatePresence>
          {loaded && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 60,
                duration: 0.8,
                delay: 0.3,
                damping: 20,
              }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-2 text-yellow-700">
                Welcome!
              </h2>
              <p className="text-lg text-gray-700 text-center">
                This is an upward animating card. You can put any content here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
