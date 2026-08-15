"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "motion/react";
import { SPRING_UI } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { navItems, type NavItem } from "@/app/lib/nav";

const SIDE_THIN = 52;
const SIDE_FULL = 176;

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
    <Link
      href={href}
      onClick={onNavigate}
      className="relative block w-full no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
    >
      <span
        className={`relative flex h-[42px] w-full items-center transition-colors duration-[120ms] ease-[var(--ease-press)] ${
          active
            ? !expanded
              ? "bg-accent/10 active:bg-accent/20"
              : "active:bg-white/[0.08]"
            : "hover:bg-white/[0.03] active:bg-white/[0.08]"
        }`}
      >
        {active && expanded && (
          <motion.span
            layoutId="nav-bar"
            className="absolute left-0 top-[22%] bottom-[22%] w-0.5 rounded-sm bg-[image:var(--spectral-seam)]"
            transition={transition}
          />
        )}
        <span className="flex h-full w-[52px] flex-shrink-0 items-center justify-center">
          <Icon
            size={15}
            strokeWidth={1.75}
            className={`shrink-0 transition-colors duration-150 ${active ? "text-fg" : "text-dim"}`}
          />
        </span>
        <motion.span
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={transition}
          className={`flex h-full items-center whitespace-nowrap font-sans text-[length:var(--text-meta)] ${
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
  const transition: Transition = reduceMotion ? { duration: 0 } : SPRING_UI;

  /* The rail is 52px of content offset (`AppShell`'s `lg:pl-[52px]`) and
   * expands to 176px, so the extra 124px is always ON TOP of the page rather
   * than beside it. Driving the page's padding from this state instead would
   * reflow the whole document on a hover gesture, which is worse. So the
   * expanded rail has to READ as a panel above the page: `data-material`
   * (translucent + blurred, and already given opaque and high-contrast
   * fallbacks in globals.css), plus a real shadow with an offset. Without
   * that elevation it was an opaque slab the same colour as the background,
   * and covering the page title with it looked like the title had been
   * truncated rather than overlapped. */
  const material = expanded
    ? "backdrop-blur-[14px] shadow-[6px_0_28px_-8px_rgba(0,0,0,0.85)]"
    : "";

  /* Collapse whenever the route changes. `onNavigate` alone did not survive
   * the transition: with the pointer resting on the rail, the click navigated
   * and the rail was still expanded over the new page. */
  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop fixed sidebar */}
      <motion.aside
        data-material={expanded ? "" : undefined}
        className={`fixed inset-y-0 left-0 z-50 hidden flex-col justify-center overflow-hidden border-r border-border bg-bg lg:flex ${material}`}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        /* Keyboard parity: without this the rail only ever opens for a
         * pointer, so a keyboard user tabbed through five unlabelled icons
         * with the names permanently at opacity 0. `focus`/`blur` bubble via
         * the capture handlers, and `relatedTarget` containment keeps the
         * panel open while focus moves between items inside it. */
        onFocusCapture={() => setExpanded(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setExpanded(false);
          }
        }}
        animate={{ width: expanded ? SIDE_FULL : SIDE_THIN }}
        transition={transition}
      >
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              expanded={expanded}
              active={
                item.end
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }
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
        data-material
        className="sticky top-0 z-40 flex h-[50px] items-center justify-between border-b border-border bg-bg/90 px-5 backdrop-blur-[14px] lg:hidden"
      >
        <Link
          href="/"
          className="relative inline-flex min-h-11 items-center pr-2 no-underline transition-opacity duration-[120ms] ease-[var(--ease-press)] active:opacity-60"
        >
          <span className="font-display text-[0.9rem] font-bold tracking-[var(--track-display-sm)] text-fg">
            SK
          </span>
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
          style={{
            gap: "clamp(0.75rem, calc(0.75rem + (100vw - 320px) * 0.12), 1.5rem)",
          }}
        >
          {navItems.map((item) => {
            const active = item.end
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                /* Opacity, not scale: these are 14px text labels, where a 3%
                 * transform is under two pixels and reads as nothing. Dimming
                 * on touch-down is what a native bar button does. */
                className="relative inline-flex min-h-11 items-center no-underline transition-opacity duration-[120ms] ease-[var(--ease-press)] active:opacity-60"
              >
                <span
                  className={`relative font-sans text-[length:var(--text-meta)] transition-colors duration-150 ${
                    active ? "text-fg after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[image:var(--spectral-seam)] after:content-['']" : "text-dim"
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
