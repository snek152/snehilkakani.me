"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const headerRef = useRef<HTMLElement>(null);
  const headerActive = useInView(headerRef, { once: true, margin: "0px 0px -15% 0px" });
  const studiesRef = useRef<HTMLDivElement>(null);
  const studiesActive = useInView(studiesRef, { once: true, margin: "0px 0px -15% 0px" });
  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <div className="px-6 pb-12 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <header ref={headerRef} className="relative mb-12 min-h-10 sm:mb-14 lg:mb-16">
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
          className="mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        />
      </header>

      <FeaturedProject project={featured} />
      <section aria-label="Project sequence" aria-labelledby="studies-heading">
        <div ref={studiesRef} className="pb-7 sm:pb-8">
          <ManifestoHeading
            id="studies-heading"
            text="More work, in sequence."
            active={studiesActive}
            className="font-display text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)] text-fg"
          />
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
