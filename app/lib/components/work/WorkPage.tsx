"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import { fadeUp } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import GridArrival from "@/app/lib/components/shared/GridArrival";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";

import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const reduceMotion = useMotionPreference();
  const headerRef = useRef<HTMLElement>(null);
  // Same trigger the /lens and /music page headings use.
  const headerActive = useInView(headerRef, { once: true, margin: "0px 0px -15% 0px" });
  const studiesRef = useRef<HTMLDivElement>(null);
  // Decodes once as the section is reached, the same one-shot scramble
  // the Experience heading uses — the two section titles on the site now
  // arrive the same way.
  const studiesActive = useInView(studiesRef, { once: true, margin: "0px 0px -15% 0px" });
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <div className="px-6 pb-24 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      {/* Full-bleed so the grid stops land on the same page percentages
        * the home hero uses, rather than being inset by this page's
        * padding and drifting out of register with it. */}
      <div className="relative -mx-6 -mt-16 mb-12 px-6 pt-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:-mt-[4.5rem] lg:px-12 lg:pt-[4.5rem]">
        <GridArrival />
        <motion.header
          ref={headerRef}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="relative z-10 border-b border-border pb-6"
        >
          <ManifestoHeading
            as="h1"
            id="builds-heading"
            text="Builds"
            active={headerActive}
            className="font-display text-5xl font-extrabold tracking-[var(--track-display-lg)] text-fg sm:text-6xl"
          />
        </motion.header>
      </div>

      <FeaturedProject project={featured} />

      <section aria-label="More projects" aria-labelledby="studies-heading">
        <div ref={studiesRef} className="mb-10 border-b border-border pb-5">
          <ManifestoHeading
            id="studies-heading"
            text="More work, in sequence."
            active={studiesActive}
            className="font-display text-4xl font-extrabold tracking-[var(--track-display-lg)] text-fg"
          />
        </div>
        <div className="flex flex-col">
          {remaining.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <SkillsMatrix />
    </div>
  );
}
