"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "motion/react";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { navItems, type NavItem } from "@/app/lib/nav";

const SIDE_THIN = 52;
const SIDE_FULL = 176;

const RAIL_SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 0.7 } as const;

function SidebarItem({
  item,
  expanded,
  active,
  onNavigate,
  transition,
}: {
  item: NavItem;
  expanded: boolean;
  active: boolean;
  onNavigate: () => void;
  transition: Transition;
}) {
  const { href, label, Icon } = item;
  return (
    <Link href={href} onClick={onNavigate} className="block no-underline">
      <span
        className={`relative flex h-[42px] items-center transition-colors duration-150 ${
          active
            ? !expanded
              ? "bg-accent/10"
              : ""
            : "hover:bg-white/[0.03]"
        }`}
      >
        {active && expanded && (
          <motion.span
            layoutId="nav-bar"
            className="absolute left-0 top-[22%] bottom-[22%] w-0.5 rounded-sm bg-accent"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <span className="flex h-full w-[52px] flex-shrink-0 items-center justify-center">
          <Icon
            size={15}
            strokeWidth={1.75}
            className={`shrink-0 transition-colors duration-150 ${active ? "text-fg" : "text-dim"}`}
          />
        </span>
        {/* Only the rail animates width. The label keeps its natural width
          * and is revealed by the rail's own `overflow-hidden`, so there is
          * one animated horizontal dimension rather than two springs racing
          * over the same axis. Toggling the rail quickly used to interrupt
          * both mid-flight and they would not settle together: measured, the
          * rail sat fully open for ~50ms while the labels were still clipped
          * to a quarter of their width, then snapped out. Animating `width`
          * to `auto` also forces a re-measure on every interruption, which
          * is what made the correction a jump rather than a slide.
          *
          * `shrink-0` because the flex row is only as wide as the rail, so
          * the label would otherwise be squeezed back to nothing by flex
          * itself once its width stopped being animated. */}
        <motion.span
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={transition}
          className={`pointer-events-none shrink-0 whitespace-nowrap font-sans text-sm ${
            active ? "font-medium text-fg" : "font-normal text-dim"
          }`}
        >
          {label}
        </motion.span>
      </span>
    </Link>
  );
}


export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useMotionPreference();
  /* AGENTS.md: always respect the motion preference. `Reveal` drops its
   * animation outright rather than substituting a gentler one, so the rail
   * matches that and snaps between widths — 124px of panel sliding out
   * under the pointer is exactly the movement the preference is asking us
   * not to make. Every other property, and the hover behaviour itself, is
   * unchanged. */
  const transition: Transition = reduceMotion ? { duration: 0 } : RAIL_SPRING;

  return (
    <>
      {/* Desktop fixed sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-50 hidden flex-col justify-center overflow-hidden border-r border-border bg-bg lg:flex"
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        animate={{ width: expanded ? SIDE_FULL : SIDE_THIN }}
        transition={transition}
      >
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              expanded={expanded}
              active={item.end ? pathname === item.href : pathname.startsWith(item.href)}
              /* Collapse on navigate so the rail is not left covering the
               * page it just moved you to. Safe to do while the pointer is
               * still inside: the rail only expands on hover *start*, and no
               * new one fires until the pointer leaves and re-enters. If the
               * pointer was out over the label column the shrinking rail
               * slides out from under it, which fires hover end — already
               * the state we are in. Either way it cannot re-open in place. */
              onNavigate={() => setExpanded(false)}
              transition={transition}
            />
          ))}
        </nav>
      </motion.aside>

      {/* Mobile sticky top bar */}
      <header
        className="sticky top-0 z-40 flex h-[50px] items-center justify-between border-b border-border px-5 backdrop-blur-[14px] lg:hidden"
        style={{ background: "rgba(8,8,8,0.9)" }}
      >
        <Link href="/" className="no-underline">
          <span className="font-display text-[0.9rem] font-extrabold text-fg">SK</span>
        </Link>
        {/* The five labels measure 192.5px together; with a fixed 24px
          * gap the row is 288.5px, which together with the "SK" wordmark
          * cannot clear the bar's 20px side padding at a 320px viewport
          * — the nav overflowed the document by 8px there. The gap ramps
          * from 12px at 320px to the full 24px at 420px instead of
          * snapping at a breakpoint, so the spacing always tracks the
          * room actually available, and at >=420px the bar is identical
          * to what it was. Inline because the expression is far more
          * legible here than as an underscore-escaped arbitrary value,
          * and the middle term is wrapped in `calc()` so no engine can
          * treat the bare math as an unparseable value and drop the whole
          * declaration back to `gap: normal`. */}
        <nav
          className="flex"
          style={{ gap: "clamp(0.75rem, calc(0.75rem + (100vw - 320px) * 0.12), 1.5rem)" }}
        >
          {navItems.map((item) => {
            const active = item.end ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="no-underline">
                <span
                  className={`font-sans text-sm transition-colors duration-150 ${
                    active ? "text-fg" : "text-dim"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
