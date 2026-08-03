"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
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
  // Drift of the photograph inside its frame as the row travels the
  // viewport. Kept well inside the 9% overhang above and below.
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-5%", "5%"],
  );
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
       * its own rather than showing two lines a gap apart. */}
      <DrawnRule className="absolute inset-x-0 top-0 [article:first-child_&]:hidden" />
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
        // Same trigger point as the rules (see `DrawnRule`), so a row's line
        // and its photograph arrive together rather than a beat apart.
        viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)" },
          shown: {
            clipPath: "inset(0 0% 0 0)",
            transition: { duration: reduceMotion ? 0 : beats(1.4), ease: EASE_OUT },
          },
        }}
      >
        {/* Taller than the frame so it has somewhere to travel. The drift
          * is small and scroll-linked — the photograph sits *into* the
          * page rather than being pasted onto it — and the overhang is
          * comfortably larger than the travel, so no edge can enter the
          * frame. No hover scale: the accent rule already says the card
          * is live, and moving the composition to repeat that was the
          * noisier half. */}
        <motion.div className="absolute -inset-y-[9%] inset-x-0" style={{ y: parallax }}>
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
      </motion.div>

      <div className="flex flex-col lg:justify-center lg:pl-10">
        {year && <p className="mb-3 text-sm tabular-nums text-dim2">{year}</p>}
        <h3 className="font-display text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-fg lg:text-[1.75rem]">
          {shortTitle(project.title)}
        </h3>
        <p className="mt-3 max-w-xl text-[0.9rem] leading-[1.7] text-dim">
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
