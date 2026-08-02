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
 */
export default function ManifestoHeading({
  text,
  active,
  className,
  id = "experience-heading",
}: {
  text: string;
  active: boolean;
  className?: string;
  id?: string;
}) {
  const reduceMotion = useMotionPreference();
  const display = useScrambleText(text, active, { skip: reduceMotion });

  return (
    <h2 id={id} aria-label={text} className={className}>
      {display || "\u00A0"}
    </h2>
  );
}
