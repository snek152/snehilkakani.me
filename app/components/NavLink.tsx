"use client";
import { AnimatePresence } from "motion/react";
import { type NavLink } from "../types";
import { useState } from "react";
import { motion } from "motion/react";

export default function NavLink({
  navlink,
  hovered,
}: {
  navlink: NavLink;
  hovered: boolean;
}) {
  const [activeP, setActiveP] = useState<boolean>(false);
  return (
    <button
      onClick={() => setActiveP((act) => !act)}
      className="relative flex items-center h-9 w-full transition-all duration-300 overflow-hidden text-secondary focus:outline-none cursor-pointer hover:bg-surface hover:text-primary"
      style={{ minWidth: 0 }}
    >
      {/* Icon container: absolutely centered horizontally */}
      <span className="absolute left-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          <motion.div
            layout
            className="w-9 h-9 flex items-center justify-center"
            style={{ position: "relative" }}
          >
            <AnimatePresence mode="sync" initial={false}>
              {activeP ? (
                <motion.span
                  key="active"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <navlink.iconActive className="w-9 h-9" />
                </motion.span>
              ) : (
                <motion.span
                  key="inactive"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <navlink.iconInactive className="w-9 h-9" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </span>
      {/* Spacer for icon width */}
      <span className="w-22" />
      {/* Animated label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ width: "100%", opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="whitespace-nowrap overflow-hidden text-lg text-left font-ibm font-medium inline-block"
          >
            {navlink.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
