"use client";
import { projects } from "../projects";
import Project from "./Project";
import { motion } from "motion/react";

const evenProjects = projects.filter((_, index) => index % 2 === 0);
const oddProjects = projects.filter((_, index) => index % 2 !== 0);

export default function AllProjects() {
  return (
    <>
      <motion.div
        className="w-full flex flex-col items-center justify-start gap-5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 60,
          duration: 0.8,
          delay: 0.4,
          damping: 20,
        }}
      >
        {evenProjects.map((project, index) => (
          <Project key={index} project={project} />
        ))}
      </motion.div>
      <motion.div
        className="w-full flex flex-col justify-start items-center gap-5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 60,
          duration: 0.8,
          delay: 0.5,
          damping: 20,
        }}
      >
        {oddProjects.map((project, index) => (
          <Project key={index} project={project} />
        ))}
      </motion.div>
    </>
  );
}
