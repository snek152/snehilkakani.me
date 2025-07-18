"use client";
import { Suspense } from "react";
import { projects } from "../projects";
// import Project from "./Project";
// import { motion } from "motion/react";
import React from "react";

const evenProjects = projects.filter((_, index) => index % 2 === 0);
const oddProjects = projects.filter((_, index) => index % 2 !== 0);

const ProjectLazy = React.lazy(() => import("./Project"));

export default function AllProjects() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-start gap-5">
        {evenProjects.map((project, index) => (
          <Suspense key={index} fallback={<div>Loading projects...</div>}>
            <ProjectLazy project={project} i={index} />
          </Suspense>
        ))}
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-5">
        {oddProjects.map((project, index) => (
          <Suspense key={index} fallback={<div>Loading projects...</div>}>
            <ProjectLazy project={project} i={index} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
