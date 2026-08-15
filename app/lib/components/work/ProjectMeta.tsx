import { ArrowUpRight, Github, LockKeyhole } from "lucide-react";
import type { Project } from "@/app/lib/data/projects";
import { shortTitle } from "./utils";

export function ProjectSkills({ skills }: Pick<Project, "skills">) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Technologies and disciplines">
      {skills.map((skill) => (
        <li
          key={skill}
          className="text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim before:mr-1.5 before:text-dim2 before:content-['/']"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}

const ICON_LINK_CLASS =
  "relative rounded-sm text-dim2 transition-[color,scale] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] hover:text-fg active:text-fg active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg";

export function ProjectLinks({ project }: { project: Project }) {
  const name = shortTitle(project.title);
  const hasPublicRepository = Boolean(project.github && !project.privateRepo);

  if (!project.link && !hasPublicRepository && !project.privateRepo) return null;

  return (
    <div className="flex shrink-0 items-center gap-3.5">
      {project.privateRepo && (
        <span
          className="inline-flex items-center gap-1.5 text-[length:var(--text-meta)] font-medium uppercase tracking-[0.08em] text-dim"
          title="Source repository is private"
        >
          <LockKeyhole size={14} strokeWidth={1.75} aria-hidden="true" />
          Private
        </span>
      )}
      {hasPublicRepository && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${name} source code on GitHub`}
          className={ICON_LINK_CLASS}
        >
          <Github size={19} strokeWidth={1.6} aria-hidden="true" />
        </a>
      )}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the ${name} project link`}
          className={ICON_LINK_CLASS}
        >
          <ArrowUpRight size={19} strokeWidth={1.6} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
