"use client";

import * as motion from "motion/react-m";
// import Image from "next/image";
import { useState } from "react";
// import LoadingSpinner from "./LoadingSpinner";

const array = [
  "Software Engineer",
  "Full-Stack Developer",
  "Music Producer",
  "Photographer",
  "Audio Engineer",
  "Graphic Designer",
  "Actor",
  "Creator",
];

// array = array
//   .map((value) => ({ value, sort: Math.random() }))
//   .sort((a, b) => a.sort - b.sort)
//   .map(({ value }) => value);

const HomePage = () => {
  const [text] = useState(array);
  //   const [animate, setAnimate] = useState(false);

  //   useEffect(() => {
  //     const timeout = setInterval(() => {
  //       if (animate) {
  //         setText((prev) => {
  //           const startIndex = (array.indexOf(prev[0]) + 1) % array.length;
  //           const newText = [];
  //           for (let i = 0; i < 5; i++) {
  //             newText.push(array[(startIndex + i) % array.length]);
  //           }
  //           return newText;
  //         });
  //       }
  //     }, 2000);
  //     return () => clearInterval(timeout);
  //   }, [animate]);

  return (
    <div className="w-screen max-w-screen fixed left-0 top-0 z-[1000] bg-secondary h-dvh lg:h-screen lg:max-h-full max-h-[calc(100dvh-4.5rem)] overflow-x-hidden ">
      <motion.div
        className="w-full h-full flex items-center justify-center relative overflow-x-hidden bg-secondary p-8 bg-gradient-to-bl from-primary/20 via-background to-primary/10 border-0 border-primary/5 shadow-xl"
        initial={{
          width: "100%",
          height: "100%",
          scale: 1,
        }}
        animate={{
          width: "100%",
          height: "100%",
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center text-surface">
          <h1 className="font-domine text-5xl md:text-7xl font-bold">
            Snehil Kakani
          </h1>
          <div className="mt-4 flex items-center font-ibm justify-center gap-x-2 gap-y-1 px-4">
            {text.slice(0, 7).map((t, index) => (
              <div
                key={t}
                className="flex items-center gap-x-2 text-lg text-surface/80"
              >
                <span>{t}</span>
                {index < text.length - 2 && (
                  <span className="text-surface/70 select-none">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
