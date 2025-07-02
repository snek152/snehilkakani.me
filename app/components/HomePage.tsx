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

const VISIT_KEY = "lastVisitTimestamp";
const HOURS_24 = 24 * 60 * 60 * 1000;
const spacing = 50;

const HomePage = () => {
  const [text, setText] = useState(array.slice(0, 3));
  const [animate, setAnimate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [needsToLoad, setNeedsToLoad] = useState(true);

  useEffect(() => {
    const lastVisit = localStorage.getItem(VISIT_KEY);
    const now = Date.now();
    if (lastVisit && now - Number(lastVisit) < HOURS_24) {
      setNeedsToLoad(false);
    } else {
      setNeedsToLoad(true);
      localStorage.setItem(VISIT_KEY, String(now));
    }
  }, []);

  useEffect(() => {
    if (!needsToLoad) {
      setLoaded(true);
      return;
    }
    document.body.style.overflowY = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflowY = "auto";
      setLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [needsToLoad]);

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
    <div className="relative w-screen h-screen">
      <motion.div
        className="w-[100vw] h-screen flex items-center justify-center relative"
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
                className={`text-5xl font-normal tracking-tight absolute font-domine self-center text-center block ${
                  index === 1 ? "text-surface" : "text-on-surface"
                } transition-colors`}
                initial={{
                  y: index === 0 ? -125 : index === 2 ? 125 : 0,
                  opacity: index === 1 ? 1 : 0,
                }}
                animate={{
                  y: index === 1 ? 0 : index === 0 ? -spacing : spacing,
                  opacity: index === 1 ? 1 : 1,
                }}
                exit={{
                  y: index === 0 ? -150 : 150,
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
      <div className="w-[100vw] lg:w-[50vw] h-[50vh] lg:h-screen flex items-center justify-center bottom-0 left-0 lg:right-0 lg:bottom-auto lg:left-auto lg:top-0 absolute">
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
              className="bg-surface rounded-xl shadow-lg p-8 flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-2 text-primary">Welcome!</h2>
              <p className="text-lg text-on-surface text-center">
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
