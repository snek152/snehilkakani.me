"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { projectYear, shortTitle } from "./utils";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const year = projectYear(project.subtitle);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: (index % 2) * 0.08,
            }
      }
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(false);
      }}
      className="group"
    >
      <div className="relative mb-4 aspect-video overflow-hidden bg-card">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: !reduceMotion && active ? 1.04 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: EASE_OUT }}
        >
          <Image
            src={project.image}
            alt={shortTitle(project.title)}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
        />
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h2 className="font-display text-[1.08rem] font-bold leading-snug tracking-[-0.02em] text-fg">
              {shortTitle(project.title)}
            </h2>
            {year && <span className="text-sm tabular-nums text-dim2">{year}</span>}
          </div>
          <p className="mt-2 text-sm leading-[1.68] text-dim">{project.description}</p>
          <div className="mt-4">
            <ProjectSkills skills={project.skills} />
          </div>
        </div>
        <ProjectLinks project={project} />
      </div>
    </motion.article>
  );
}
