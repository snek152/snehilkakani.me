"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import Hero from "./Hero";
import HomeContent from "./HomeContent";

/**
 * Owns Hero's own scroll-progress value (0 at Hero's top hitting the
 * viewport top, 1 at Hero's bottom hitting it) — Hero needs a ref to
 * itself from outside to measure this, which a component can't get on
 * its own without either `useScroll`-ing against its own not-yet-mounted
 * node or a parent holding the ref, hence this thin wrapper.
 */
export default function HomeShell() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <Hero ref={heroRef} progress={heroProgress} />
      <HomeContent heroProgress={heroProgress} />
    </>
  );
}
