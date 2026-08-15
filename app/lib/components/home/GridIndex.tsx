"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navItems, type NavItem } from "@/app/lib/nav";

const BLURBS: Record<string, string> = {
  "/builds": "Selected projects and tools",
  "/music": "Beats and production",
  "/lens": "Photography portfolio",
  "/reach": "Get in touch",
};

const items = navItems.filter((item) => item.href in BLURBS);

export default function GridIndex() {
  return (
    <nav
      aria-label="Explore the site"
      className="relative -mx-6 grid grid-cols-4 sm:-mx-8 lg:-mx-12"
    >
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-border" />
      {items.map((item, index) => (
        <Cell
          key={item.href}
          item={item}
          index={index}
          first={index === 0}
          last={index === items.length - 1}
        />
      ))}
    </nav>
  );
}

function Cell({
  item,
  index,
  first,
  last,
}: {
  item: NavItem;
  index: number;
  first: boolean;
  last: boolean;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 top-0 w-px bg-border/50 ${
          last ? "right-0" : ""
        }`}
        style={last ? undefined : { left: `${((index + 1) / items.length) * 100}%` }}
      />
      <div>
        <Link
          href={item.href}
          className={`group flex h-full items-start justify-between gap-2 py-4 no-underline transition-transform duration-[120ms] ease-[var(--ease-press)] active:scale-[0.98] sm:py-5 ${
            first ? "pl-4 sm:pl-8 lg:pl-12" : "pl-2 sm:pl-4 lg:pl-6"
          } ${last ? "pr-4 sm:pr-8 lg:pr-12" : "pr-2 sm:pr-4 lg:pr-6"}`}
        >
          <span className="min-w-0">
            <span className="block break-words font-display text-[length:var(--size-display-sm)] font-semibold tracking-[var(--track-display-sm)] text-dim transition-colors duration-200 ease-[var(--ease-press)] group-hover:text-fg">
              {item.label}
            </span>
            <span className="mt-1 sr-only text-[length:var(--text-micro)] leading-snug tracking-[var(--track-text-sm)] text-dim sm:not-sr-only sm:block">
              {BLURBS[item.href]}
            </span>
          </span>
          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="mt-0.5 hidden shrink-0 text-dim2 transition-[translate,color] duration-200 ease-[var(--ease-press)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg sm:block"
          />
        </Link>
      </div>
    </>
  );
}
