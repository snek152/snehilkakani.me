"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import Hero from "./Hero";
import HomeContent from "./HomeContent";

export default function HomeShell() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <Hero ref={heroRef} progress={heroProgress} />
      <HomeContent />
    </>
  );
}
