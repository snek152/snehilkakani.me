"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "motion/react";
import { SPRING_UI } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { navItems, type NavItem } from "@/app/lib/nav";

const SIDE_THIN = 52;
const SIDE_FULL = 176;
const ITEM_HEIGHT = 42;
const INDICATOR_INSET = ITEM_HEIGHT * 0.18;
const INDICATOR_HEIGHT = ITEM_HEIGHT - INDICATOR_INSET * 2;

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
      className="relative block w-full cursor-pointer no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
    >
      <span
        className={`relative flex h-[42px] w-full items-center transition-colors duration-[120ms] ease-[var(--ease-press)] ${
          active
            ? "bg-accent/15 hover:bg-accent/20 active:bg-accent/25"
            : "hover:bg-white/[0.03] active:bg-white/[0.08]"
        }`}
      >
        <span className="flex h-full w-[52px] flex-shrink-0 items-center justify-center">
          <Icon
            size={15}
            strokeWidth={1.75}
            className={`shrink-0 transition-colors duration-150 ${active ? "text-accent" : "text-dim"}`}
          />
        </span>
        <motion.span
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={transition}
          className={`flex h-full items-center whitespace-nowrap font-sans text-[length:var(--text-meta)] ${
            active ? "font-medium text-fg" : "font-normal text-dim tracking-[var(--track-text-sm)]"
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
  const pointerSuppressedUntilLeaveRef = useRef(false);
  const collapseAfterIndicatorRef = useRef(false);

  const transition: Transition = reduceMotion ? { duration: 0 } : SPRING_UI;

  const material = expanded
    ? "backdrop-blur-[14px] shadow-[6px_0_28px_-8px_rgba(0,0,0,0.85)]"
    : "";

  const activeIndex = navItems.findIndex((item) =>
    item.end ? pathname === item.href : pathname.startsWith(item.href)
  );

  useEffect(() => {
    if (collapseAfterIndicatorRef.current || asideRef.current?.contains(document.activeElement)) return;
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
        className={`fixed inset-y-0 left-0 z-50 hidden grid-rows-[52px_1fr] overflow-hidden border-r border-border bg-bg lg:grid ${material}`}
        onPointerDown={() => {
          inputModalityRef.current = "pointer";
        }}
        onPointerEnter={() => {
          inputModalityRef.current = "pointer";
          if (!pointerSuppressedUntilLeaveRef.current) setExpanded(true);
        }}
        onPointerLeave={() => {
          pointerSuppressedUntilLeaveRef.current = false;
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
        <Link
          href="/"
          aria-label="Home"
          className="flex h-[52px] w-[52px] items-center justify-center no-underline transition-opacity duration-[120ms] ease-[var(--ease-press)] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent active:opacity-60"
        >
          <Image src="/brand-mark.svg" alt="" aria-hidden width={32} height={32} unoptimized priority className="size-8 object-contain" />
        </Link>
        <nav className="relative self-center">
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 w-1 bg-accent"
            style={{ top: INDICATOR_INSET, height: INDICATOR_HEIGHT }}
            initial={false}
            animate={{
              y: activeIndex >= 0 ? activeIndex * ITEM_HEIGHT : 0,
              opacity: activeIndex >= 0 ? 1 : 0,
            }}
            transition={transition}
            onAnimationComplete={() => {
              if (!collapseAfterIndicatorRef.current) return;
              collapseAfterIndicatorRef.current = false;
              setExpanded(false);
            }}
          />
          {navItems.map((item, index) => (
            <SidebarItem
              key={item.href}
              item={item}
              expanded={expanded}
              active={index === activeIndex}
              onNavigate={(event) => {
                if (event.detail === 0) return;
                inputModalityRef.current = "pointer";
                pointerSuppressedUntilLeaveRef.current = true;
                if (index === activeIndex) {
                  setExpanded(false);
                  return;
                }
                collapseAfterIndicatorRef.current = true;
                if (reduceMotion) {
                  collapseAfterIndicatorRef.current = false;
                  setExpanded(false);
                }
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
          aria-label="Home"
          className="relative inline-flex min-h-11 shrink-0 cursor-pointer items-center pr-2 no-underline transition-opacity duration-[120ms] ease-[var(--ease-press)] active:opacity-60"
        >
          <Image src="/brand-mark.svg" alt="" aria-hidden width={32} height={32} unoptimized priority className="size-8 object-contain" />
        </Link>

        <nav className="flex min-w-0 flex-1 justify-end gap-3 overflow-x-auto">
          {navItems.map((item) => {
            const active = item.end
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative inline-flex min-h-11 cursor-pointer items-center no-underline transition-opacity duration-[120ms] ease-[var(--ease-press)] active:opacity-60"
              >
                <span
                  className={`relative font-sans text-[length:var(--text-meta)] transition-colors duration-150 ${
                    active ? "font-medium text-fg" : "text-dim tracking-[var(--track-text-sm)]"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="mobile-active-indicator"
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-accent"
                      transition={transition}
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
