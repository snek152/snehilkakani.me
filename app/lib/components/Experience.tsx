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
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className="w-full border-secondary group/experience bg-background relative rounded-xl overflow-hidden border-4 shadow-lg"
    style={{
      boxShadow: "0 8px 32px 0 rgba(13, 110, 253, 0.19)",
    }}
  >
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60 group-hover/experience:w-1.5 transition-all duration-300 z-10" />

    <div className="relative z-10 flex p-4 lg:p-5 flex-col">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-1.5 mb-3">
        <div className="flex-1">
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-surface font-domine leading-tight">
            {title}
          </h3>
          <p className="text-base lg:text-lg text-surface/80 font-ibm font-semibold mt-0.5">
            {company}
          </p>
        </div>
        <div className="flex flex-col gap-0 lg:text-right text-sm lg:text-base mt-0.5 lg:mt-0">
          <p className="text-surface/70 font-ibm">{location}</p>
          <p className="text-surface/60 font-ibm italic">{period}</p>
        </div>
      </div>

      <ul className="space-y-1.5 mb-3">
        {description.map((item, i) => (
          <li
            key={i}
            className="text-sm lg:text-base text-surface font-ibm leading-relaxed flex items-start gap-2"
          >
            <span className="text-primary mt-1 flex-shrink-0">•</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>

      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 text-surface px-3 py-1 rounded-full text-sm font-ibm border-2 border-primary/70 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
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
          className="mb-8 lg:mb-10 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-surface font-domine">
            Work Experience
          </h1>
        </motion.div>
        <div className="space-y-5 lg:space-y-6">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
