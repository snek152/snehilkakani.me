"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { dateRange } from "@/app/lib/format";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { ProjectBlurb, ProjectLinks, ProjectSkills } from "./ProjectMeta";

export default function FeaturedProject({ project }: { project: Project }) {
  const reduceMotion = useMotionPreference();
  const [active, setActive] = useState(false);
  const secondary = project.secondaryImage;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : beats(0.75), ease: EASE_OUT }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setActive(false);
      }}
      className="group relative grid gap-y-10 pb-10 pt-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-12 lg:pb-14 lg:pt-2"
    >

      <div className="flex flex-col">
        {project.subtitle && (
          <p className="mb-2 text-[length:var(--text-body)] tabular-nums tracking-[var(--track-text-sm)] text-dim">
            {dateRange(project.subtitle)}
          </p>
        )}
        <h3 className="font-display text-[length:var(--size-display-md)] font-semibold leading-tight tracking-[var(--track-display-md)] text-fg text-balance">
          {project.title}
        </h3>
        <div className="mt-4">
          <ProjectBlurb project={project} />
        </div>
        <div className="mt-5">
          <ProjectSkills skills={project.skills} />
        </div>
        <div className="mt-6">
          <ProjectLinks project={project} />
        </div>
      </div>

      <div className="relative flex flex-col gap-3 max-lg:order-first lg:mb-10 lg:block">
        <div className="relative overflow-hidden border border-border">
          <Image
            src={project.image}
            alt={project.title}
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="h-auto w-full"
          />
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_38%,transparent),transparent)]"
            animate={{ scaleX: active ? 1 : 0.38 }}
            transition={{
              duration: reduceMotion ? 0 : beats(1),
              ease: EASE_OUT,
            }}
          />
        </div>
        {secondary && (
          <div className="bg-bg lg:absolute lg:-bottom-10 lg:-left-6 lg:w-[44%] lg:p-1.5">
            <div className="relative overflow-hidden border border-border">
              <Image
                src={secondary}
                alt=""
                priority
                sizes="(min-width: 1024px) 26vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
