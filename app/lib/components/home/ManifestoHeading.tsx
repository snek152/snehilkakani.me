"use client";

import { useEffect } from "react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

function hasScrambled(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(`scrambled:${id}`) === "1";
  } catch {
    return false;
  }
}

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
  const alreadyScrambled = hasScrambled(id);
  const display = useScrambleText(text, active, {
    skip: reduceMotion || alreadyScrambled,
  });

  useEffect(() => {
    if (!active || alreadyScrambled) return;
    try {
      sessionStorage.setItem(`scrambled:${id}`, "1");
    } catch {}
  }, [active, alreadyScrambled, id]);

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || "\u00A0"}</span>
    </Tag>
  );
}
