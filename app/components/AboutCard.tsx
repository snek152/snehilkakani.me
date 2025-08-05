import * as motion from "motion/react-m";
import Card from "./Card";
import Image from "next/image";
import {
  CameraIcon,
  ClockIcon,
  SunIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import aboutphoto from "../../public/about.jpg";

export default function AboutCard() {
  return (
    <Card className="flex flex-col mx-2 lg:mx-15 lg:h-auto h-auto">
      {/* Top bar with icons */}
      <div className="flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 bg-background/10 border-b rounded-t-xl border-secondary">
        <div className="flex items-center gap-2">
          <span className="block w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-surface"></span>
          <span className="block w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-surface"></span>
          <span className="block w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-surface"></span>
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
            src={aboutphoto}
            alt="photo of snehil kakani in front of the manhattan bridge"
            width={600}
            height={600}
            className="object-cover object-center h-[32dvh] lg:h-[45dvh] w-full"
            priority
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
            className="absolute bottom-4 left-4 flex gap-2 z-10 bg-on-surface/60 rounded-lg px-3 py-2 shadow-lg backdrop-blur-xs"
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
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary w-full text-left font-domine tracking-tight relative">
            Snehil Kakani
          </h1>
          <h2 className="text-sm lg:text-base text-on-surface font-domine w-full text-left mb-2">
            Incoming Freshman at Cal Poly, SLO
          </h2>
          <p className="text-on-surface font-ibm text-sm w-full lg:text-base lg:w-[38ch] 2xl:w-[50ch]">
            Focused on computer science and software engineering. Passionate
            about creating innovative solutions and exploring new technologies.
            Exploring music production and photography.
          </p>
        </div>
      </div>
      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 py-1.5 lg:py-2 bg-secondary">
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
          <rect x="3" y="4" width="8" height="2" rx="1" fill="currentColor" />
        </svg>
      </div>
    </Card>
  );
}
