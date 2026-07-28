"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { Reveal } from "@/app/lib/components/shared/Reveal";
import { useProximity } from "@/app/lib/components/shared/CursorField";
import { beats } from "@/app/lib/tempo";

/** The full experience list, always fully shown — no accordion toggle, no
 * separate "featured" treatment for the first entry. The previous design
 * split Fere into its own bigger card and collapsed the rest behind a
 * click, with an expanded-panel indent hand-tuned against the collapsed
 * header's column widths (`pl-[calc(34%+1.5rem)]`) that drifted out of
 * alignment the moment either changed. Every entry now renders identically
 * — accent bullets, tabular period, skill chips, always visible, plus a
 * left-edge accent bar that reads the shared `CursorField` and rises as
 * the cursor nears that row — the same ambient light `IndexStrip`'s links
 * react to, reaching this list too rather than stopping at the nav. */
export default function ExperienceAccordion({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="border-t border-border">
      {experiences.map((experience, index) => (
        <ExperienceRow key={experience.company + experience.title} experience={experience} index={index} />
      ))}
    </div>
  );
}

function ExperienceRow({ experience, index }: { experience: Experience; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const proximity = useProximity(rowRef, 260);
  const barScale = useTransform(proximity, [0, 1], [0, 1]);

  return (
    <Reveal
      ref={rowRef}
      y={14}
      duration={beats(0.6)}
      delay={Math.min(index, 3) * beats(0.125)}
      amount={0.3}
      className="relative border-b border-border py-6 pl-4 sm:py-7"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-2 left-0 w-0.5 origin-center bg-accent"
        style={{ scaleY: barScale }}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <h3 className="font-display text-lg font-bold tracking-[-0.01em] text-fg">{experience.company}</h3>
          <span className="text-sm text-dim">{experience.title}</span>
        </div>
        <span className="text-sm tabular-nums text-dim2">{experience.period}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium tracking-[0.03em] text-dim2 uppercase">{experience.location}</p>
      <ul className="mt-4 space-y-2">
        {experience.description.map((line) => (
          <li key={line} className="flex gap-3 text-sm leading-6 text-dim">
            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      {experience.skills && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {experience.skills.map((skill) => (
            <li key={skill} className="border border-border px-2.5 py-1 text-sm text-dim">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
