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
  // const [cursor, setCursor] = useState<boolean>(false);
  const [activeP, setActiveP] = useState<boolean>(false);
  return (
    <button
      onClick={() => setActiveP((act) => !act)}
      className="relative w-full flex items-center justify-start gap-2 transition-all duration-300 overflow-hidden px-3 text-secondary focus:outline-none cursor-pointer hover:bg-surface hover:text-primary"
      style={{ minWidth: 0 }}
      // onMouseEnter={() => setCursor(true)}
      // onMouseLeave={() => setCursor(false)}
    >
      {/* <AnimatePresence>
        <motion.span
          layout
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: cursor ? 1 : 0,
            opacity: cursor ? 1 : 0,
            boxShadow: cursor
              ? "0 2px 8px 0 rgba(80, 80, 255, 0.15)"
              : "0 0px 0px 0 rgba(0,0,0,0)",
          }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 22,
            opacity: { duration: 0.18 },
          }}
          className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-primary to-blue-400 origin-left pointer-events-none rounded-full"
        />
      </AnimatePresence> */}
      {/* Icon and label */}
      <span className="flex-shrink-0">
        <AnimatePresence>
          <motion.div
            layout
            className="w-6 h-6 flex items-center justify-center"
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
                  <navlink.iconActive className="w-6 h-6" />
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
                  <navlink.iconInactive className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="whitespace-nowrap overflow-hidden text-left font-sans inline-block"
            // style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            {navlink.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
