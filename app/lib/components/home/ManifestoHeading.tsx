"use client";

import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

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
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || "\u00A0"}</span>
    </Tag>
  );
}
