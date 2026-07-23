"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { navItems, type NavItem } from "@/app/lib/nav";

const SIDE_THIN = 52;
const SIDE_FULL = 176;

const RAIL_SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 0.7 } as const;

function SidebarItem({ item, expanded, active }: { item: NavItem; expanded: boolean; active: boolean }) {
  const { href, label, Icon } = item;
  return (
    <Link href={href} className="block no-underline">
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
            className={`shrink-0 transition-colors duration-150 ${active ? "text-accent" : "text-dim"}`}
          />
        </span>
        <motion.span
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
          transition={RAIL_SPRING}
          className={`pointer-events-none overflow-hidden whitespace-nowrap font-sans text-sm ${
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

  return (
    <>
      {/* Desktop fixed sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-50 hidden flex-col justify-center overflow-hidden border-r border-border bg-bg lg:flex"
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        animate={{ width: expanded ? SIDE_FULL : SIDE_THIN }}
        transition={RAIL_SPRING}
      >
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              expanded={expanded}
              active={item.end ? pathname === item.href : pathname.startsWith(item.href)}
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
        <nav className="flex gap-6">
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
