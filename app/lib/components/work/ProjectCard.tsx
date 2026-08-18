"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT, SPRING_UI } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import { beats } from "@/app/lib/tempo";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { dateRange } from "@/app/lib/format";

export default function ProjectCard({
  project,
  sequenceIndex,
  compact = false,
}: {
  project: Project;
  sequenceIndex: number;
  compact?: boolean;
}) {
  const reduceMotion = useMotionPreference();
  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [renderOpen, setRenderOpen] = useState(false);
  const reversesTrajectory = sequenceIndex % 2 === 1;
  if (compact) {
    return (
      <motion.details
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "100000px 0px -10% 0px" }}
        transition={{ duration: reduceMotion ? 0 : beats(0.5), ease: EASE_OUT }}
        open={renderOpen}
        className="group border-b border-border first:border-t"
      >
        <summary
          onClick={(event) => {
            event.preventDefault();
            if (isOpen) {
              setIsOpen(false);
            } else {
              setRenderOpen(true);
              setIsOpen(true);
            }
          }}
          className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 text-fg marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent [&::-webkit-details-marker]:hidden"
        >
          <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
            {project.subtitle && (
              <span className="shrink-0 text-[length:var(--text-meta)] font-medium tabular-nums tracking-[var(--track-text-sm)] text-dim2">
                {dateRange(project.subtitle)}
              </span>
            )}
            <h3 className="text-[length:var(--text-body)] font-semibold tracking-[var(--track-text-sm)] text-fg">
              {project.title}
            </h3>
          </span>
          <Plus
            aria-hidden="true"
            className={`size-4 shrink-0 text-accent transition-transform duration-[160ms] ease-[var(--ease-press)] ${isOpen ? "rotate-45" : ""}`}
            strokeWidth={1.75}
          />
        </summary>
        <motion.div
          inert={!isOpen}
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : SPRING_UI}
          onAnimationComplete={() => {
            if (!isOpen) setRenderOpen(false);
          }}
          className="block overflow-hidden"
        >
          <div className="grid gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="max-w-[var(--measure-body)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-dim">
                {project.description}
              </p>
              <div className="mt-5">
                <ProjectSkills skills={project.skills} />
              </div>
              <div className="mt-6">
                <ProjectLinks project={project} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.details>
    );
  }

  return (
    <motion.article
      initial={reduceMotion ? false : undefined}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setActive(false);
      }}
      className="group relative isolate grid gap-y-5 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-0 lg:py-12"
    >
      <div className="absolute -inset-x-6 top-0 sm:-inset-x-8 lg:-inset-x-12 [article:first-child_&]:hidden">
        <DrawnRule />
      </div>

      <motion.div
        className={`relative aspect-[16/10] overflow-hidden ${reversesTrajectory ? "lg:order-2" : ""}`}
        initial={reduceMotion ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
        variants={{
          hidden: {
            clipPath: reversesTrajectory
              ? "inset(0 0 0 100%)"
              : "inset(0 100% 0 0)",
          },
          shown: {
            clipPath: "inset(0 0% 0 0)",
            transition: {
              duration: reduceMotion ? 0 : beats(1.4),
              ease: EASE_OUT,
              delay: reduceMotion ? 0 : beats(0.15),
            },
          },
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover"
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_42%,transparent),transparent)]"
          animate={{ scaleX: active ? 1 : 0.25 }}
          transition={{
            duration: reduceMotion ? 0 : beats(0.45),
            ease: EASE_OUT,
          }}
        />
      </motion.div>

      <div
        className={`flex flex-col lg:justify-center ${reversesTrajectory ? "lg:order-1 lg:pr-12" : "lg:pl-12"}`}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
          transition={{
            duration: reduceMotion ? 0 : beats(0.6),
            ease: EASE_OUT,
            delay: reduceMotion ? 0 : beats(0.23),
          }}
        >
          {project.subtitle && (
            <p className="mb-3 text-[length:var(--text-body)] tabular-nums tracking-[var(--track-text-sm)] text-dim">
              {dateRange(project.subtitle)}
            </p>
          )}
          <h3 className="font-display text-[length:var(--size-display-md)] font-semibold leading-tight tracking-[var(--track-display-md)] text-fg text-balance line-clamp-3">
            {project.title}
          </h3>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
          transition={{
            duration: reduceMotion ? 0 : beats(0.6),
            ease: EASE_OUT,
            delay: reduceMotion ? 0 : beats(0.3),
          }}
        >
          <p className="mt-3 max-w-[var(--measure-body)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-dim">
            {project.description}
          </p>
          <div className="mt-5">
            <ProjectSkills skills={project.skills} />
          </div>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
