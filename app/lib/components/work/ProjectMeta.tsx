import { ArrowUpRight, Github, LockKeyhole } from "lucide-react";
import type { Project } from "@/app/lib/data/projects";
import { shortTitle } from "./utils";

export function ProjectSkills({ skills }: Pick<Project, "skills">) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Technologies and disciplines">
      {skills.map((skill) => (
        <li
          key={skill}
          className="text-sm font-medium text-dim2 before:mr-1.5 before:text-accent before:content-['/']"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}

export function ProjectLinks({ project }: { project: Project }) {
  const name = shortTitle(project.title);
  const hasPublicRepository = Boolean(project.github && !project.privateRepo);

  if (!project.link && !hasPublicRepository && !project.privateRepo) return null;

  return (
    <div className="flex shrink-0 items-center gap-3">
      {project.privateRepo && (
        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.04em] text-dim2"
          title="Source repository is private"
        >
          <LockKeyhole size={12} strokeWidth={1.75} aria-hidden="true" />
          Private
        </span>
      )}
      {hasPublicRepository && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${name} source code on GitHub`}
          className="rounded-sm text-dim2 transition-colors duration-150 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
        >
          <Github size={15} strokeWidth={1.75} aria-hidden="true" />
        </a>
      )}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the ${name} project link`}
          className="rounded-sm text-dim2 transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
        >
          <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
