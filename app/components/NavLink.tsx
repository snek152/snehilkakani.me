"use client";
import { AnimatePresence } from "motion/react";
import { type NavLink } from "../types";
// import { useState } from "react";
import * as motion from "motion/react-m";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLink({
  navlink,
  hovered,
}: {
  navlink: NavLink;
  hovered: boolean;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={navlink.href}
      // onClick={() => setActiveP((act) => !act)}
      className="relative flex lg:flex-row flex-col lg:items-center lg:h-8 lg:w-full w-8 h-full transition-all duration-300 overflow-hidden text-surface focus:outline-none cursor-pointer hover:text-primary"
      style={{ minWidth: 0 }}
    >
      {/* Icon container: absolutely centered horizontally */}
      <span className="absolute left-0 top-0 lg:h-full lg:w-12 w-full h-12 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          <motion.div
            layout
            className="w-8 h-8 flex items-center justify-center"
            style={{ position: "relative" }}
          >
            <AnimatePresence mode="sync" initial={false}>
              {pathname === navlink.href ? (
                <motion.span
                  key="active"
                  initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <navlink.iconActive className="w-8 h-8" />
                </motion.span>
              ) : (
                <motion.span
                  key="inactive"
                  initial={{ opacity: 0, scale: 1, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 30 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <navlink.iconInactive className="w-8 h-8" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </span>
      {/* Spacer for icon width */}
      <span className="lg:w-20 w-0" />
      {/* Animated label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ width: "100%", opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="whitespace-nowrap lg:visible invisible overflow-hidden text-base text-left font-ibm font-medium inline-block"
          >
            {navlink.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
