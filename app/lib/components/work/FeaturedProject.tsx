"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { projectYear, shortTitle } from "./utils";

export default function FeaturedProject({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const year = projectYear(project.subtitle);
  const hasPublicRepository = Boolean(project.github && !project.privateRepo);
  const accessLabel = project.privateRepo ? "Private" : hasPublicRepository ? "Public" : null;
  const readout = [
    year,
    `${project.skills.length} stack`,
    accessLabel,
  ].filter(Boolean) as string[];
  const cropTransition = { duration: reduceMotion ? 0 : 0.65, ease: EASE_OUT };


  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(false);
      }}
      className="mb-16 grid overflow-hidden border border-border lg:mb-[4.5rem] lg:grid-cols-[55fr_45fr]"
    >
      <ViewfinderFrame className="min-h-[220px] overflow-hidden bg-card sm:min-h-[290px] lg:min-h-[360px]">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: !reduceMotion && active ? 1.025 : 1 }}
          transition={cropTransition}
        >
          <Image
            src={project.image}
            alt={shortTitle(project.title)}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={cropTransition}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 bg-bg/85 px-2.5 py-1.5 text-sm tabular-nums text-fg"
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
          transition={cropTransition}
        >
          {readout.join(" · ")}
        </motion.div>
      </ViewfinderFrame>

      <div className="flex flex-col justify-end border-t border-border px-6 py-8 sm:px-8 sm:py-9 lg:border-l lg:border-t-0">
        <span className="mb-5 self-start bg-accent px-2.5 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-white">
          Featured
        </span>
        {project.subtitle && (
          <p className="mb-2 text-sm font-medium text-dim2">{project.subtitle}</p>
        )}
        <h2 className="font-display text-[1.85rem] font-extrabold leading-tight tracking-[-0.03em] text-fg">
          {shortTitle(project.title)}
        </h2>
        <p className="mt-3 max-w-xl text-[0.875rem] leading-[1.72] text-dim">
          {project.description}
        </p>
        <div className="mt-5">
          <ProjectSkills skills={project.skills} />
        </div>
        <div className="mt-6">
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.article>
  );
}
