import { ArrowUpRight, Github, LockKeyhole } from "lucide-react";
import type { Project } from "@/app/lib/data/projects";
import { shortTitle } from "./utils";

export function ProjectSkills({ skills }: Pick<Project, "skills">) {
  return (
    // The slash is a divider, so it is set as one. In `--accent` it was a
    // 3.87:1 blue tick repeated down every row, reading as decoration on the
    // row's least legible line.
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

// Both icon links are deliberately one treatment, so they cannot drift apart.
// Tailwind v4 scale utilities use the independent `scale` property, not
// `transform`; the transition list must therefore name `scale`.
//
// `relative` + a contentful `::before` at `-inset-1` lifts the tap target from
// the icon's own 19x19 box to 27x27, clearing the 24x24 floor (WCAG 2.5.8)
// without growing the visible icon or shifting the row. Same technique as
// `Footer`, at half the inset: these sit on `gap-3.5` (14px), so 8px a side
// would make two adjacent hit areas overlap and leave points on the row
// ambiguous. 4px a side leaves 6px of clearance between them.
const ICON_LINK_CLASS =
  "relative rounded-sm text-dim2 transition-[color,scale] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-1 before:content-[''] hover:text-fg active:text-fg active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg";

export function ProjectLinks({ project }: { project: Project }) {
  const name = shortTitle(project.title);
  const hasPublicRepository = Boolean(project.github && !project.privateRepo);

  if (!project.link && !hasPublicRepository && !project.privateRepo) return null;

  return (
    <div className="flex shrink-0 items-center gap-3.5">
      {project.privateRepo && (
        <span
          // This readable status label is body-copy contrast, not recessive icon contrast.
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
