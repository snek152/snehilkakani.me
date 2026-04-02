"use client";
import { experiences } from "../data/experience";
import React from "react";
import * as motion from "motion/react-m";

const ExperienceCard = ({
  title,
  company,
  location,
  period,
  description,
  skills,
  index,
}: {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  skills?: string[];
  index: number;
}) => (
  <div className="relative flex gap-5 lg:gap-7">
    {/* Timeline spine */}
    <div className="flex flex-col items-center flex-shrink-0 w-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-2.5 h-2.5 rounded-full bg-primary mt-4 flex-shrink-0 z-10"
      />
      <div className="w-px flex-1 mt-2 mb-5 bg-primary/20" />
    </div>

    {/* Card + spacing wrapper */}
    <div className="flex-1 pb-5 lg:pb-6">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.45,
          delay: index * 0.08,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="w-full bg-background border-[1.5px] border-secondary/60 rounded-xl overflow-hidden shadow-lg p-4 lg:p-5"
      >
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-0.5 lg:gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-surface font-domine leading-tight">
              {title}
            </h3>
            <p className="text-sm lg:text-base text-surface/70 font-ibm font-semibold mt-0.5">
              {company}
            </p>
          </div>
          <div className="flex flex-row lg:flex-col lg:items-end gap-2 lg:gap-0.5 mt-1 lg:mt-0.5 flex-shrink-0">
            <span className="text-surface/60 font-ibm text-sm whitespace-nowrap">
              {period}
            </span>
            <span className="text-surface/50 font-ibm text-sm whitespace-nowrap lg:text-right">
              {location}
            </span>
          </div>
        </div>

        {/* Description bullets */}
        <ul className="space-y-2 mb-4">
          {description.map((item, i) => (
            <li
              key={i}
              className="text-sm lg:text-base text-surface font-ibm leading-relaxed flex items-start gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0 mt-[0.65rem]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 text-surface z-20 relative px-3 py-1 rounded-full text-sm font-ibm border-2 border-primary/70 shadow-md hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg transition-all duration-200 font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  </div>
);

export default function Experience() {
  return (
    <div className="w-full px-5 py-8 lg:py-12 col-span-1 lg:col-span-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-10 lg:mb-12 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-surface font-domine">
            Work Experience
          </h1>
        </motion.div>
        <div className="pl-1">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
