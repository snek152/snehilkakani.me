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
      initial={reduceMotion ? false : undefined}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setActive(false);
      }}
      // An even split with no column gap, so the photograph's right edge
      // lands exactly on the page's centre grid stop - the same line Hero
      // draws, the index divides at, and the featured band above splits
      // on. At 57/43 that edge sat 77px past the line; with a gap it sat
      // 20px short of it, because a gap centres the *gutter* on the line
      // rather than the edge you can actually see. The gutter is inside
      // the text column instead.
      className="group relative isolate grid gap-y-5 py-10 first:pt-0 last:pb-0 lg:grid-cols-2 lg:gap-x-0 lg:py-14 lg:last:pb-0"
    >
      {/* Struck across as the row arrives — the same rule-draw the
       * Experience list uses, so the two pages read as one system. The
       * first row sits under the section header's own rule, so it skips
       * its own rather than showing two lines a gap apart.
       *
       * Full-bleed, matching Experience, where the `<ol>` carries the
       * negative margins instead. The bleed lives on this WRAPPER, never on
       * the article: the article's grid is aligned so the photograph's right
       * edge lands on the page's centre stop (see the comment above), and
       * negative margins plus compensating padding on it would move that
       * edge. The wrapper is positioned, has no layout effect, and the rule
       * inside it stays `w-full` of the bled box. */}
      <div className="absolute -inset-x-6 top-0 sm:-inset-x-8 lg:-inset-x-12 [article:first-child_&]:hidden">
        <DrawnRule />
      </div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -inset-y-2 -z-10 bg-accent blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      {/* The frame is *clipped* open left-to-right, travelling the same
       * direction as the rule above it, so the row reads as one gesture
       * crossing the page. A wipe, not a fade: it matches how the rules
       * are drawn.
       *
       * This used to be a page-coloured panel sliding off the frame,
       * which had two tells. It was opaque, so it masked the cursor
       * field's glow and sat there as a flat black rectangle on a page
       * that was subtly lit everywhere else. And being a separate
       * composited layer over a transformed row, its edges could drift a
       * pixel out of register during a fast scroll and show a sliver of
       * the photograph above and below it. Clipping the frame itself
       * removes the layer, so there is nothing to mask the glow with and
       * nothing to misalign. */}
      <motion.div
        className="relative aspect-[16/10] overflow-hidden"
        initial={reduceMotion ? false : "hidden"}
        whileInView="shown"
        // The photograph has its own observer timing. `DrawnRule` starts at a
        // fixed 240px reading-band lead; this frame keeps its established
        // -18% margin because it is a separate image reveal. Those values can
        // put the rule or image first depending on viewport width, and that is
        // intentional: matching them would couple a structural divider to a
        // photograph's entrance merely to make them land in lockstep.
        viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)" },
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
        {/* No hover scale and no scroll drift: the accent rule already says
         * the card is live, and moving the composition to repeat that was
         * the noisier half. */}
        <Image
          src={project.image}
          alt={shortTitle(project.title)}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
        />
      </motion.div>

      <div className="flex flex-col lg:justify-center lg:pl-10">
        {/* Second beat of the wake, offset a further ~beats(0.08) past the
         * photograph so the row reads image, then heading, in that order. */}
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
          {year && <p className="mb-3 text-[length:var(--text-meta)] tabular-nums tracking-[var(--track-text-sm)] text-dim">{year}</p>}
          <h3 className="font-display text-[length:var(--size-display-md)] font-semibold leading-tight tracking-[var(--track-display-md)] text-fg text-balance line-clamp-3">
            {shortTitle(project.title)}
          </h3>
        </motion.div>
        {/* Third beat: capped at ~beats(0.3) behind the rule so a 7,000px
         * page of these rows never turns the stagger into a chore. */}
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
