"use client";

import { motion } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import { fadeUp } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";

import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const reduceMotion = useMotionPreference();
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <div className="px-6 pb-24 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <motion.header
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
        className="mb-12 flex items-end justify-between gap-6 border-b border-border pb-6"
      >
        <div>
          <h1 className="font-display text-5xl font-extrabold tracking-[-0.03em] text-fg sm:text-6xl">
            Work
          </h1>
        </div>
        <p className="hidden shrink-0 pb-2 text-sm text-dim2 sm:block">
          <span className="tabular-nums">{String(projects.length).padStart(2, "0")}</span> projects
        </p>
      </motion.header>

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
          {remaining.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>

      <SkillsMatrix />
    </div>
  );
}
