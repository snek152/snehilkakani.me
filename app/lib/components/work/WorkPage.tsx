"use client";

import { motion, useReducedMotion } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import { fadeUp } from "@/app/lib/motion";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import ProjectRail from "./ProjectRail";
import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const reduceMotion = useReducedMotion();
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <div className="px-6 pb-24 pt-24 sm:px-10 lg:px-14">
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

      <ProjectRail projects={remaining} />
      <section aria-label="More projects" className="grid grid-cols-1 gap-x-10 gap-y-14 lg:hidden">
        {remaining.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </section>

      <SkillsMatrix />
    </div>
  );
}
