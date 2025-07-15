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
  "w-8 h-8 text-on-surface hover:text-secondary transition-colors duration-200";
export default function About() {
  return (
    <div className="min-h-screen w-full grid place-items-center gap-5 px-5 grid-cols-2">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 60,
          duration: 0.7,
          delay: 0.2,
          damping: 18,
        }}
        className="w-full rounded-xl col-span-2 bg-surface p-8 space-y-4 shadow-lg"
      >
        <h1 className="text-3xl font-semibold text-center font-domine tracking-tight text-secondary">
          My Tools
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-2">
            <h2 className="text-lg font-medium font-domine text-on-surface">
              Frontend
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
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
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-medium font-domine text-on-surface">
              Backend
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <SiPython className={iconClasses} />
              <SiFirebase className={iconClasses} />
              <SiPytorch className={iconClasses} />
              <SiNodedotjs className={iconClasses} />
              <SiPrisma className={iconClasses} />
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
