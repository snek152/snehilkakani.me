"use client";

import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

/**
 * One-shot companion to `RoleCycle`'s scramble-decode: shares the same
 * cadence but decodes exactly once, triggered by `active` flipping true
 * instead of an interval. Used to make the Experience heading feel like
 * it's assembling out of the marquee ticker's motion — the ticker
 * decelerates at the same moment this decodes, so the reader's attention
 * transfers from one to the other rather than the heading just appearing.
 *
 * `as` because the page-level headings (`/builds`, `/reach`) are their
 * document's `h1` while the section headings are `h2`. The effect is the
 * same; only the level differs, and the level is the caller's to decide.
 */
export default function ManifestoHeading({
  text,
  active,
  className,
  id = "experience-heading",
  as: Tag = "h2",
}: {
  text: string;
  active: boolean;
  className?: string;
  id?: string;
  as?: "h1" | "h2";
}) {
  const reduceMotion = useMotionPreference();
  const display = useScrambleText(text, active, { skip: reduceMotion });

  return (
    <Tag id={id} className={className}>
      {/* The heading's real text, always in the document even while the
        * visible layer is still mid-decode — this used to be an
        * `aria-label` over a `&nbsp;`, which reads correctly but leaves the
        * markup with no heading text in it. That was survivable on a
        * section `h2`; it is not on a page's `h1`. Assistive tech takes its
        * name from here, and the decoding glyphs are hidden from it rather
        * than being announced as they churn. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || "\u00A0"}</span>
    </Tag>
  );
}
