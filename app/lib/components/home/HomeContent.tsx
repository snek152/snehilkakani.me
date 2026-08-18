"use client";

import { motion } from "motion/react";
import { experiences } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ExperienceList from "./ExperienceList";
import GridIndex from "./GridIndex";

export default function HomeContent() {
  const reduceMotion = useMotionPreference();

  return (
    <div className="px-6 pb-20 sm:px-8 lg:px-12 lg:pb-12">
      <GridIndex />
      <motion.section
        aria-label="Experience"
        className="mt-0"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: beats(0.75), ease: EASE_OUT }}
      >
        <ExperienceList experiences={experiences} />
      </motion.section>
    </div>
  );
}
