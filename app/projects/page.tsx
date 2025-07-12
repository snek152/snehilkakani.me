"use client";
import {
  SiCss,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { motion } from "motion/react";

const iconClasses =
  "w-10 h-10 text-on-surface hover:text-primary transition-colors duration-300";

export default function About() {
  return (
    <div className="h-screen w-full grid place-items-center gap-5 px-5 grid-cols-2">
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
        className="rounded-xl shadow-xl relative w-full col-span-2 flex flex-col gap-5 items-start justify-center bg-surface backdrop-blur-sm p-8 overflow-hidden"
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/100 to-secondary/20 blur-lg opacity-50"></div> */}
        <h1 className="text-3xl font-bold text-secondary w-full text-center font-domine tracking-tight relative">
          My Tools
        </h1>
        <div className="flex gap-5 z-20 items-center justify-center flex-wrap">
          <h1 className="text-2xl text-on-surface text-center font-domine tracking-tight relative">
            Frontend Design
          </h1>
          <SiJavascript className={iconClasses} />
          <SiTypescript className={iconClasses} />
          <SiHtml5 className={iconClasses} />
          <SiCss className={iconClasses} />
          <SiReact className={iconClasses} />
          <SiNextdotjs className={iconClasses} />
          <SiTailwindcss className={iconClasses} />
          <SiSvelte className={iconClasses} />
          <SiGit className={iconClasses} />
        </div>
        <div className="flex gap-5 z-20 items-center justify-center flex-wrap">
          <h1 className="text-2xl text-on-surface text-center font-domine tracking-tight relative">
            Backend Development
          </h1>
          <SiPython className={iconClasses} />
          <SiFirebase className={iconClasses} />
          <SiPytorch className={iconClasses} />
          <SiNodedotjs className={iconClasses} />
          <SiPrisma className={iconClasses} />
        </div>
      </motion.div>
    </div>
  );
}
