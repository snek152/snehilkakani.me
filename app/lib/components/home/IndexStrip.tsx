"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useProximity } from "@/app/lib/components/shared/CursorField";
import { navItems, type NavItem } from "@/app/lib/nav";

const BLURBS: Record<string, string> = {
  "/projects": "Selected builds and products",
  "/music": "Beats and production",
  "/gallery": "Photography portfolio",
  "/contact": "Get in touch",
};

const items = navItems.filter((item) => item.href in BLURBS);

/** A quiet wayfinding strip between Hero and Experience — a single thin
 * bar, not a section of its own. Previous versions gave this four full-
 * width rows and an elaborate scroll-linked reveal; none of that content
 * needs that much of the page, so it's collapsed to one line of compact
 * links. The blurb moves to a title tooltip rather than visible text.
 *
 * Each link also reads the shared `CursorField`: as the pointer nears
 * (not yet hovering), a faint accent glow rises behind it — the same
 * light `CursorGlow` casts across the page, now legible on the
 * interface itself. Purely a background layer, so it never fights with
 * the label's own hover/focus color (plain CSS, unaffected by this). */
export default function IndexStrip() {
  const reduceMotion = useMotionPreference();

  return (
    <motion.nav
      aria-label="Explore the site"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="mt-8 border-y border-border sm:mt-10"
    >
      <ul className="flex flex-wrap">
        {items.map((item) => (
          <li key={item.href} className="border-r border-border last:border-r-0">
            <IndexLink item={item} />
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

function IndexLink({ item }: { item: NavItem }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const proximity = useProximity(ref, 140);
  const glowOpacity = useTransform(proximity, [0, 1], [0, 0.16]);

  return (
    <Link
      ref={ref}
      href={item.href}
      title={BLURBS[item.href]}
      className="group relative flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-dim2 no-underline transition-colors duration-150 hover:text-accent sm:px-6"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-accent"
        style={{ opacity: glowOpacity }}
      />
      <span className="relative">{item.label}</span>
      <ArrowUpRight
        size={13}
        strokeWidth={2}
        className="relative text-dim2/70 transition-colors duration-150 group-hover:text-accent"
      />
    </Link>
  );
}
