"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const reduceMotion = useMotionPreference();
  const headerRef = useRef<HTMLElement>(null);
  const headerActive = useInView(headerRef, { once: true, margin: "0px 0px -15% 0px" });
  const studiesRef = useRef<HTMLDivElement>(null);
  const studiesActive = useInView(studiesRef, { once: true, margin: "0px 0px -15% 0px" });
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <div className="px-6 pb-24 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <motion.header
        ref={headerRef}
        initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: reduceMotion ? 0 : beats(1.1), ease: EASE_OUT }}
        className="relative mb-14 grid overflow-hidden border-y border-border py-7 sm:mb-16 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10 lg:mb-20 lg:py-9"
      >
        <div className="relative z-10">
          <ManifestoHeading
            as="h1"
            id="builds-heading"
            text="Builds"
            active={headerActive}
            className="font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg text-balance"
          />
        </div>
        <RouteSignal
          scene="builds"
          label="Builds"
          detail={projects[0].title}
          className="relative z-10 mt-6 sm:mt-0"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-2/5 bg-[linear-gradient(112deg,transparent_12%,color-mix(in_srgb,var(--accent)_30%,transparent)_48%,transparent_74%)]"
        />
      </motion.header>

      <FeaturedProject project={featured} />

      <section aria-label="Project sequence" aria-labelledby="studies-heading">
        <div ref={studiesRef} className="grid gap-5 pb-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <ManifestoHeading
            id="studies-heading"
            text="More work, in sequence."
            active={studiesActive}
            className="font-display text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)] text-fg"
          />
          <span aria-hidden="true" className="h-px w-24 bg-border sm:mb-2" />
        </div>
        <div className="-mx-6 mb-10 sm:-mx-8 lg:-mx-12">
          <DrawnRule />
        </div>
        <div className="flex flex-col">
          {remaining.map((project, index) => (
            <ProjectCard key={project.title} project={project} sequenceIndex={index} />
          ))}
        </div>
      </section>

      <SkillsMatrix />
    </div>
  );
}
