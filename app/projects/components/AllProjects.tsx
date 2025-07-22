"use client";
import { Suspense } from "react";
import { projects } from "../projects";
// import Project from "./Project";
// import { motion } from "motion/react";
import React from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const evenProjects = projects.filter((_, index) => index % 2 === 0);
const oddProjects = projects.filter((_, index) => index % 2 !== 0);

const ProjectLazy = React.lazy(() => import("./Project"));

export default function AllProjects() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-start gap-5">
        {evenProjects.map((project, index) => (
          <Suspense key={index} fallback={<LoadingSpinner className="!h-72" />}>
            <ProjectLazy project={project} />
          </Suspense>
        ))}
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-5">
        {oddProjects.map((project, index) => (
          <Suspense key={index} fallback={<LoadingSpinner className="!h-72" />}>
            <ProjectLazy project={project} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
