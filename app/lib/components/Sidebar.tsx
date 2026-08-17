"use client";

import { useEffect, useRef, useState } from "react";
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
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  transition: Transition;
}) {
  const { href, label, Icon } = item;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className="relative block w-full no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
    >
      <span
        className={`relative flex h-[42px] w-full items-center transition-colors duration-[120ms] ease-[var(--ease-press)] ${
          active
            ? "bg-accent/10 hover:bg-accent/15 active:bg-accent/20"
            : "hover:bg-white/[0.03] active:bg-white/[0.08]"
        }`}
      >
        {active && (
          <motion.span
            aria-hidden
            className="absolute left-0 top-[22%] bottom-[22%] w-0.5 origin-center rounded-sm bg-[image:var(--spectral-seam)]"
            animate={{ opacity: expanded ? 1 : 0, scaleY: expanded ? 1 : 0.4 }}
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
  const inputModalityRef = useRef<"keyboard" | "pointer">("keyboard");
  const asideRef = useRef<HTMLElement | null>(null);

  const transition: Transition = reduceMotion ? { duration: 0 } : SPRING_UI;

  const material = expanded
    ? "backdrop-blur-[14px] shadow-[6px_0_28px_-8px_rgba(0,0,0,0.85)]"
    : "";

  useEffect(() => {
    if (asideRef.current?.contains(document.activeElement)) return;
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.metaKey || event.ctrlKey || event.altKey) return;
      inputModalityRef.current = "keyboard";
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);

  return (
    <>

      <motion.aside
        ref={asideRef}
        data-material={expanded ? "" : undefined}
        className={`fixed inset-y-0 left-0 z-50 hidden flex-col justify-center overflow-hidden border-r border-border bg-bg lg:flex ${material}`}
        onPointerDown={() => {
          inputModalityRef.current = "pointer";
        }}
        onPointerMove={() => {
          inputModalityRef.current = "pointer";
          setExpanded(true);
        }}
        onPointerLeave={() => {
          setExpanded(false);
        }}
        onFocus={() => {
          if (inputModalityRef.current === "keyboard") setExpanded(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
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

              onNavigate={(event) => {
                if (event.detail === 0) return;
                inputModalityRef.current = "pointer";
                setExpanded(false);
              }}
              transition={transition}
            />
          ))}
        </nav>
      </motion.aside>

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

        <nav
          className="flex min-w-0 overflow-x-auto"
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
                aria-current={active ? "page" : undefined}
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
