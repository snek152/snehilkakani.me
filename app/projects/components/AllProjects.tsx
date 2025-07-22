"use client";
import { Suspense } from "react";
import { projects } from "../projects";
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
          <Suspense
            key={index}
            fallback={
              <LoadingSpinner
                width={24}
                height={24}
                style={{
                  height: project.description.length + "px",
                  borderRadius: "2rem",
                  border: "2px solid var(--color-secondary)",
                  backgroundColor: "var(--color-background)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "0.5rem",
                }}
              />
            }
          >
            <ProjectLazy project={project} />
          </Suspense>
        ))}
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-5">
        {oddProjects.map((project, index) => (
          <Suspense
            key={index}
            fallback={
              <LoadingSpinner
                width={24}
                height={24}
                style={{
                  height: project.description.length + "px",
                  borderRadius: "2rem",
                  border: "2px solid var(--color-secondary)",
                  backgroundColor: "var(--color-background)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "0.5rem",
                }}
              />
            }
          >
            <ProjectLazy project={project} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
