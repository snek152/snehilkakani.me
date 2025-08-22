import Image from "next/image";
import { Project as ProjectT } from "../data/projects";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import React from "react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import * as motion from "motion/react-m";

const Project = React.memo(({ project }: { project: ProjectT }) => {
  return (
    <section
      style={{ willChange: "transform, opacity" }}
      className="w-full border-secondary group/project bg-background relative p-0 rounded-xl overflow-hidden border-[1.5px] shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between gap-2 px-3 lg:px-4 py-2 lg:py-2 bg-secondary/70 backdrop-blur-xs shadow-lg absolute top-2 right-2 z-30 text-primary border-2 border-primary/5 rounded-2xl"
      >
        {project.github && (
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center flex-shrink-0 w-7 h-7 lg:w-6 lg:h-6 text-surface hover:text-primary active:text-primary rounded-full transition-colors duration-300 text-xs"
            title="More information"
          >
            <SiGithub className="w-full h-full" />
          </motion.a>
        )}
        {project.link && (
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group/button justify-center flex-shrink-0 w-7 h-7 lg:w-6 lg:h-6 rounded-full transition-colors duration-300 text-xs bg-surface hover:bg-primary active:bg-primary"
            title="More information"
          >
            <ArrowUpRightIcon className="w-6 h-6 lg:w-5 lg:h-5 text-secondary/80 group-hover/button:text-surface transition-colors duration-300" />
          </motion.a>
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src={project.image}
          alt={project.title}
          placeholder="blur"
          className="object-cover object-top opacity-70 w-full h-48 lg:h-64 group-hover/project:opacity-90 transition-opacity duration-300"
        />
      </motion.div>

      <div className="relative z-30 flex p-6 rounded-xl flex-col items-left text-left overflow-hidden">
        <h1 className="text-2xl font-bold tracking-tight text-surface mb-2 font-domine">
          <span className="text-primary text-lg mr-0.25">{"<"}</span>
          {project.title}
          <span className="text-primary text-lg ml-0.25">{"/>"}</span>
        </h1>

        {project.subtitle && (
          <h2 className="text-sm font-semibold text-surface/80 font-mono text-left mb-3">
            <span className="text-surface/80">{"// "}</span>
            {project.subtitle}
          </h2>
        )}

        <p className="text-surface text-base w-full mb-5 font-ibm leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 justify-left w-full">
          {project.skills.map(
            (skill, index) =>
              skill && (
                <span
                  key={index}
                  className="bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 text-surface z-20 relative px-3 py-1 rounded-full text-sm font-ibm border-2 border-primary/70 shadow-md hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg transition-all duration-200 font-semibold"
                >
                  {skill}
                </span>
              )
          )}
        </div>
      </div>
    </section>
  );
});

Project.displayName = "Project";
export default Project;
