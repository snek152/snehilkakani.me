"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  CameraIcon,
  ClockIcon,
  SunIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import Card from "./Card";

let array = [
  "Software Engineer",
  "Full-Stack Developer",
  "Music Producer",
  "Photographer",
  "Audio Engineer",
  "Graphic Designer",
  "Actor",
];

array = array
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

const VISIT_KEY = "lastVisitTimestamp";
const HOURS_24 = 24 * 60 * 60 * 1000;
const spacing = 50;

const HomePage = () => {
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
    <div className="relative w-screen max-w-full h-screen overflow-x-hidden">
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
                : "50%"
              : "100%",
          scale: needsToLoad === false ? 0.8 : 1,
        }}
        animate={{
          width: loaded ? (window.innerWidth >= 1024 ? "50%" : "100%") : "100%",
          height: loaded
            ? window.innerWidth >= 1024
              ? "100%"
              : "50%"
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
      <div className="w-full lg:w-[50%] h-[50%] lg:h-screen flex items-center justify-center bottom-0 left-0 lg:right-0 lg:bottom-auto lg:left-auto lg:top-0 absolute">
        <AnimatePresence>
          {loaded && (
            <Card className="flex flex-col mx-15">
              {/* Top bar with icons */}
              <div className="flex items-center justify-between px-4 py-3 bg-background/10 border-b rounded-t-xl border-secondary">
                <div className="flex items-center gap-2">
                  <span className="block w-3 h-3 rounded-full bg-surface"></span>
                  <span className="block w-3 h-3 rounded-full bg-surface"></span>
                  <span className="block w-3 h-3 rounded-full bg-surface"></span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Viewfinder icon */}
                  <svg
                    width="22"
                    height="14"
                    viewBox="0 0 22 14"
                    fill="none"
                    className="text-surface/60"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="20"
                      height="12"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="17"
                      cy="7"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="3"
                      y="4"
                      width="6"
                      height="6"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
              {/* Camera details bar */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.5,
                  }}
                  className="text-xs text-surface font-ibm bg-on-surface px-2 py-0.5 rounded shadow"
                >
                  FUJIFILM
                </motion.span>
                <span className="w-2 h-2 rounded-full bg-primary border border-secondary"></span>
              </div>
              <div className="relative bg-surface">
                <div className="relative">
                  <Image
                    src="/about.jpg"
                    alt="photo of snehil kakani in front of the manhattan bridge"
                    width={200}
                    height={200}
                    className="object-cover object-center h-72 w-full"
                  />
                  {/* Name and subtitle top-left overlay */}
                  {/* <motion.div
                    className="absolute top-4 left-4 z-20 bg-on-surface/70 rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm flex flex-col items-start"
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                      delay: 0.5,
                    }}
                  >
                    <span className="text-3xl font-semibold text-surface font-domine leading-tight">
                      Snehil Kakani
                    </span>
                    <span className="text-xs text-surface/80 font-ibm mt-0.5">
                      Software Engineer & Creator
                    </span>
                  </motion.div> */}
                  {/* Camera settings bottom-left overlay */}
                  <motion.div
                    className="absolute bottom-4 left-4 flex gap-2 z-10 bg-on-surface/40 rounded-lg px-3 py-2 shadow-lg backdrop-blur-xs"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                      delay: 0.7,
                    }}
                  >
                    {/* Exposure */}
                    <motion.span
                      className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.85, duration: 0.3 }}
                    >
                      <SunIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
                      +0.3
                    </motion.span>
                    {/* Shutter Speed */}
                    <motion.span
                      className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.95, duration: 0.3 }}
                    >
                      <ClockIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
                      1/250
                    </motion.span>
                    {/* Aperture */}
                    <motion.span
                      className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.05, duration: 0.3 }}
                    >
                      <ViewfinderCircleIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
                      f/3.5
                    </motion.span>
                    {/* ISO */}
                    <motion.span
                      className="flex items-center text-white text-[0.6rem] font-mono gap-0.5"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.15, duration: 0.3 }}
                    >
                      <CameraIcon className="w-3 h-3 opacity-70 mb-[1.5px]" />
                      100
                    </motion.span>
                  </motion.div>
                </div>
                {/* Minimalist camera settings overlay */}

                <div className="flex flex-col my-4 mx-4 items-left">
                  <h1 className="text-3xl font-bold text-secondary w-full text-left font-domine tracking-tight relative">
                    Snehil Kakani
                  </h1>
                  <p className="text-on-surface font-ibm text-base w-[38ch]">
                    Focused on computer science and software engineering.
                    Passionate about creating innovative solutions and exploring
                    new technologies. Exploring music production and
                    photography.
                  </p>
                </div>
              </div>
              {/* Bottom controls */}
              <div className="flex items-center justify-center gap-4 py-2 bg-secondary">
                {/* Shutter button */}
                <span className="w-4 h-4 rounded-full bg-surface border-2 border-on-surface shadow-inner"></span>
                {/* Mode dial */}
                <span className="w-3 h-3 rounded-full bg-secondary border border-surface  "></span>
                {/* Battery icon */}
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  className="text-surface"
                >
                  <rect
                    x="1"
                    y="2"
                    width="14"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <rect
                    x="15"
                    y="4"
                    width="2"
                    height="2"
                    rx="0.5"
                    fill="currentColor"
                  />
                  <rect
                    x="3"
                    y="4"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
