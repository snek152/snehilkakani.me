"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useProximity } from "@/app/lib/components/shared/CursorField";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import { beats } from "@/app/lib/tempo";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { projectYear, shortTitle } from "./utils";

/**
 * A single project, full width, in ordinary document flow.
 *
 * This replaced a pinned horizontal rail. The rail had to reserve a whole
 * viewport of scroll height per card, which meant its content — one card
 * tall — could never fill the space it claimed, so it left a void above
 * and below no matter how the frame was sized or centred. Laying the
 * projects out as wide rows costs nothing in vertical rhythm, gives each
 * screenshot roughly twice the width it had in the rail, and leaves the
 * page scrolling at the reader's own pace.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const reduceMotion = useMotionPreference();
  const articleRef = useRef<HTMLElement>(null);
  const proximity = useProximity(articleRef, 320);
  const glowOpacity = useTransform(proximity, [0, 1], [0, 0.06]);
  const [active, setActive] = useState(false);
  const year = projectYear(project.subtitle);

  return (
    <motion.article
      ref={articleRef}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : beats(0.85), ease: EASE_OUT }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(false);
      }}
      className="group relative isolate grid gap-x-10 gap-y-5 py-10 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] lg:py-14 lg:last:pb-0"
    >
      {/* Struck across as the row arrives — the same rule-draw the
        * Experience list uses, so the two pages read as one system. The
        * first row sits under the section header's own rule, so it skips
        * its own rather than showing two lines a gap apart. */}
      <DrawnRule className="absolute inset-x-0 top-0 [article:first-child_&]:hidden" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -inset-y-2 -z-10 bg-accent blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      {/* The image is uncovered left-to-right by a shutter travelling the
        * same direction as the rule above it, so the row reads as one
        * gesture crossing the page rather than a rule and a photo each
        * doing their own thing. A wipe, not a fade: it matches how the
        * rules are drawn. */}
      <motion.div
        className="relative aspect-[16/10] overflow-hidden bg-card"
        initial={reduceMotion ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, margin: "100000px 0px -10% 0px" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: !reduceMotion && active ? 1.03 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: EASE_OUT }}
        >
          <Image
            src={project.image}
            alt={shortTitle(project.title)}
            fill
            sizes="(min-width: 1024px) 57vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
        />
        {/* The shutter itself: page-coloured, covering the frame, and
          * retracting to the right.
          *
          * Not rendered at all under reduced motion. Its resting state is
          * "covering" — an opaque block is what an un-animated shutter
          * *is* — so leaving it in place for those readers would hide the
          * photograph behind it rather than merely skipping an effect. */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 origin-right bg-card"
            variants={{
              hidden: { scaleX: 1 },
              shown: { scaleX: 0, transition: { duration: beats(1.4), ease: EASE_OUT } },
            }}
          />
        )}
      </motion.div>

      <div className="flex flex-col lg:justify-center">
        {year && <p className="mb-3 text-sm tabular-nums text-dim2">{year}</p>}
        <h3 className="font-display text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-fg lg:text-[1.75rem]">
          {shortTitle(project.title)}
        </h3>
        <p className="mt-3 max-w-xl text-[0.9rem] leading-[1.7] text-dim">{project.description}</p>
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
