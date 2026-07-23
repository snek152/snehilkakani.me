"use client";

import { motion, useReducedMotion } from "motion/react";
import { experiences } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";

import ExperienceAccordion from "./ExperienceAccordion";
import FeaturedExperience from "./FeaturedExperience";
import Marquee from "./Marquee";

const featuredExperience = experiences[0];
const remainingExperiences = experiences.slice(1);

export default function HomeContent() {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? undefined : { opacity: 1, y: 0 };

  return (
    <div className="px-6 pb-20 sm:px-8 lg:px-12 lg:pb-24">
      <Marquee />
      <motion.section
        aria-labelledby="experience-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={entrance}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="mt-12"
      >
        <div className="mb-5 flex items-end justify-between gap-6">
          <h2
            id="experience-heading"
            className="font-display text-[1.6rem] font-bold tracking-[-0.02em] text-fg"
          >
            Experience
          </h2>
        </div>
        <FeaturedExperience experience={featuredExperience} />
        <ExperienceAccordion experiences={remainingExperiences} />
      </motion.section>
    </div>
  );
}
