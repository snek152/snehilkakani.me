"use client";

import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
// import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
// import LoadingSpinner from "./LoadingSpinner";

const array = [
  "Software Engineer",
  "Full-Stack Developer",
  "Music Producer",
  "Photographer",
  "Audio Engineer",
  "Graphic Designer",
  "Actor",
];

const AboutCard = dynamic(() => import("./AboutCard"));

// array = array
//   .map((value) => ({ value, sort: Math.random() }))
//   .sort((a, b) => a.sort - b.sort)
//   .map(({ value }) => value);

const VISIT_KEY = "lastVisitTimestamp";
const HOURS_24 = 24 * 60 * 60 * 1000;
// const spacing = 50;

const HomePage = () => {
  const spacing = useMemo(() => {
    if (typeof window === "undefined") {
      return 50; // Default value for server-side rendering
    }
    return window.innerWidth >= 1024 ? 50 : 35;
  }, []);
  const outValue = useMemo(() => {
    if (typeof window === "undefined") {
      return 125; // Default value for server-side rendering
    }
    return window.innerWidth >= 1024 ? 125 : 100;
  }, []);
  const [text, setText] = useState(array.slice(0, 3));
  const [animate, setAnimate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [needsToLoad, setNeedsToLoad] = useState<null | boolean>(null);

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
    if (needsToLoad === false) {
      setLoaded(true);
      document.getElementById("container")!.style.overflowY = "scroll"; // Ensure overflow is reset
      return;
    }
    document.getElementById("container")!.style.overflowY = "hidden";
    const timer = setTimeout(() => {
      document.getElementById("container")!.style.overflowY = "scroll";
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

  if (needsToLoad === null) {
    // Prevent rendering until needsToLoad is determined
    return null;
  }

  return (
    <div className="relative w-screen max-w-full h-screen lg:max-h-full max-h-[calc(100vh-5rem)] overflow-x-hidden">
      <motion.div
        className="w-full h-full flex items-center justify-center relative overflow-x-hidden"
        initial={{
          width:
            needsToLoad === false
              ? window.innerWidth >= 1024
                ? "50%"
                : "100%"
              : "100%",
          height:
            needsToLoad === false
              ? window.innerWidth >= 1024
                ? "100%"
                : "30%"
              : "100%",
          scale: needsToLoad === false ? 0.8 : 1,
        }}
        animate={{
          width: loaded ? (window.innerWidth >= 1024 ? "50%" : "100%") : "100%",
          height: loaded
            ? window.innerWidth >= 1024
              ? "100%"
              : "30%"
            : "100%",
          scale: 1,
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
                className={`text-3xl lg:text-5xl font-normal absolute font-domine self-center text-center block ${
                  index === 1 ? "text-surface" : "text-on-surface"
                } transition-colors`}
                initial={{
                  y: index === 0 ? -outValue : index === 2 ? outValue : 0,
                  opacity: index === 1 ? 1 : 0,
                }}
                animate={{
                  y: index === 1 ? 0 : index === 0 ? -spacing : spacing,
                  opacity: index === 1 ? 1 : 1,
                }}
                exit={{
                  y: index === 0 ? -outValue : outValue,
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
      <div className="w-full lg:w-[50%] h-[70%] lg:h-screen flex items-center justify-center bottom-0 left-0 lg:right-0 lg:bottom-auto lg:left-auto lg:top-0 absolute">
        <AnimatePresence>
          {loaded && (
            <Suspense fallback={<></>}>
              <AboutCard />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
