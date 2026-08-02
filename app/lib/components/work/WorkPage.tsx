"use client";

import { motion } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import { fadeUp } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import GridArrival from "@/app/lib/components/shared/GridArrival";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";

import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const reduceMotion = useMotionPreference();
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <div className="px-6 pb-24 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      {/* Full-bleed so the grid stops land on the same page percentages
        * the home hero uses, rather than being inset by this page's
        * padding and drifting out of register with it. */}
      <div className="relative -mx-6 -mt-16 mb-12 px-6 pt-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:-mt-[4.5rem] lg:px-12 lg:pt-[4.5rem]">
        <GridArrival />
        <motion.header
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="relative z-10 border-b border-border pb-6"
        >
          <h1 className="font-display text-5xl font-extrabold tracking-[-0.03em] text-fg sm:text-6xl">
            Work
          </h1>
        </motion.header>
      </div>

      <FeaturedProject project={featured} />

      <section aria-label="More projects">
        <div className="mb-10 flex items-end justify-between border-b border-border pb-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-dim2">
              Selected studies
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-fg">
              More work, in sequence.
            </h2>
          </div>
        </div>
        <div className="flex flex-col">
          {remaining.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <SkillsMatrix />
    </div>
  );
}
