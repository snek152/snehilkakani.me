"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { shortTitle } from "./utils";



export default function FeaturedProject({ project }: { project: Project }) {
  const reduceMotion = useMotionPreference();
  const [active, setActive] = useState(false);
  const cropTransition = { duration: reduceMotion ? 0 : 0.65, ease: EASE_OUT };

  const secondary = project.secondaryImage;

  // No hover scale on either photo. The accent rule already marks the
  // card as live; moving the photograph to say the same thing shifted the
  // very composition the reader was looking at. `active` stays — it still
  // drives that rule.
  const primaryImage = (
    <div className="absolute inset-0">
      <Image
        src={project.image}
        alt={shortTitle(project.title)}
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  const accentRule = (
    <motion.span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
      animate={{ scaleX: active ? 1 : 0 }}
      transition={cropTransition}
    />
  );

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
      className={`mb-16 grid overflow-hidden border border-border lg:mb-[4.5rem] ${
        secondary ? "" : "lg:grid-cols-[55fr_45fr]"
      }`}
    >
      {secondary ? (
        /* Two photos, evenly split, inside a single frame: the corner
         * ticks and the accent rule belong to the pair, not to the left
         * half. The band carries one aspect ratio so both halves share a
         * height, and `object-cover` takes the small crop that costs.
         *
         * The corners strike in after the header grid above has finished
         * arriving (its last line lands at ~2 beats), so the page's
         * opening gesture resolves into this card rather than the two
         * happening independently. */
        <ViewfinderFrame className="overflow-hidden bg-card" enterDelay={beats(2)}>
          <div className="grid grid-cols-2" style={{ aspectRatio: "3" }}>
            <div className="relative overflow-hidden">{primaryImage}</div>
            <div className="relative overflow-hidden border-l border-border">
              <div className="absolute inset-0">
                <Image
                  src={secondary}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          {accentRule}
        </ViewfinderFrame>
      ) : (
        <ViewfinderFrame
          className="min-h-[220px] overflow-hidden bg-card sm:min-h-[290px] lg:min-h-[360px]"
          enterDelay={beats(2)}
        >
          {primaryImage}
          {accentRule}
        </ViewfinderFrame>
      )}

      <div
        className={`flex flex-col justify-end border-t border-border px-6 py-8 sm:px-8 sm:py-9 ${
          secondary ? "" : "lg:border-l lg:border-t-0"
        }`}
      >
        <span className="mb-5 self-start bg-accent px-2.5 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-white">
          Featured
        </span>
        {project.subtitle && (
          <p className="mb-2 text-sm font-medium text-dim2">{project.subtitle}</p>
        )}
        <h2 className="font-display text-[1.85rem] font-extrabold leading-tight tracking-[-0.03em] text-fg">
          {shortTitle(project.title)}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.875rem] leading-[1.72] text-dim">
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
