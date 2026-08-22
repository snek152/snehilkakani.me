"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import SkillsMatrix from "./SkillsMatrix";

export default function WorkPage() {
  const headerRef = useRef<HTMLElement>(null);
  const headerActive = useInView(headerRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });
  const featured = projects[0];
  const detailed = projects.slice(1, 6);
  const rest = projects.slice(6);

  return (
    <div className="px-6 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-8">
      <header
        ref={headerRef}
        className="relative mb-12 min-h-10 sm:mb-4 lg:mb-8"
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
          className="mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        />
      </header>

      <section aria-label="Projects">
        <FeaturedProject project={featured} />
        <div className="relative -mx-6 sm:-mx-8 lg:-mx-12">
          <DrawnRule />
        </div>

        <div className="flex flex-col">
          {detailed.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              sequenceIndex={index}
            />
          ))}
        </div>

        <div className="flex flex-col">
          {rest.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              sequenceIndex={index}
              compact
            />
          ))}
        </div>
      </section>

      <SkillsMatrix />
    </div>
  );
}
