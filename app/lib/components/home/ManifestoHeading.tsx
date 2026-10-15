"use client";

import { useEffect, useState } from "react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useScrambleText } from "@/app/lib/hooks/useScrambleText";

function hasScrambled(id: string): boolean {
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
  const [alreadyScrambled, setAlreadyScrambled] = useState(false);
  const display = useScrambleText(text, active, {
    skip: reduceMotion || alreadyScrambled,
  });

  useEffect(() => {
    setAlreadyScrambled(hasScrambled(id));
  }, [id]);

  useEffect(() => {
    if (!active) return;
    try {
      sessionStorage.setItem(`scrambled:${id}`, "1");
    } catch {}
  }, [active, id]);

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || "\u00A0"}</span>
    </Tag>
  );
}
