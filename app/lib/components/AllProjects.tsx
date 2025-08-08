"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { projects } from "../data/projects";
import LoadingSpinner from "@/app/lib/components/LoadingSpinner";
import dynamic from "next/dynamic";
import * as motion from "motion/react-m";

const evenProjects = projects.filter((_, index) => index % 2 === 0);
const oddProjects = projects.filter((_, index) => index % 2 !== 0);

const ProjectLazy = dynamic(() => import("./Project"));

export default function AllProjects() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const lg = useMemo(() => (width === null ? null : width >= 1024), [width]);

  if (lg === null) {
    return null;
  }

  return lg ? (
    <>
      <div className="w-full flex flex-col items-center justify-start gap-5">
        {evenProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ y: 40, opacity: 0 }}
            //   animate={{ y: 0, opacity: 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "tween",
              // stiffness: 150,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              // stiffness: 60,
              delay: index <= 0 ? 0.1 : 0.1,
              // damping: 20,
            }}
          >
            <Suspense
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
          </motion.div>
        ))}
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-5">
        {oddProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ y: 40, opacity: 0 }}
            //   animate={{ y: 0, opacity: 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              // stiffness: 150,
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.5,
              // stiffness: 60,
              delay: index <= 0 ? 0.1 : 0.1,
              // damping: 20,
              type: "tween",
            }}
          >
            <Suspense
              // key={index}
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
          </motion.div>
        ))}
      </div>
    </>
  ) : (
    <div
      className="w-full flex col-span-2
     flex-col justify-start items-center gap-5"
    >
      {projects.map((project, index) => (
        <motion.div
          key={index}
          initial={{ y: 40, opacity: 0 }}
          //   animate={{ y: 0, opacity: 1 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "tween",
            // stiffness: 150,
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 0.5,
            // stiffness: 60,
            delay: index === 0 ? 0.1 : 0.1,
            // damping: 20,
          }}
        >
          <Suspense
            // key={index}
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
        </motion.div>
      ))}
    </div>
  );
}
