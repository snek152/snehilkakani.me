"use client";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";

import NavLink from "./NavLink";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import ContactModal from "./ContactModal";
import { navlinks } from "../navlinks";

export default function Navbar() {
  const [hovered, setHovered] = useState<boolean>(false);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const lg = useMemo(() => (width === null ? null : width >= 1024), [width]);

  useEffect(() => {
    document.getElementById("topbar")?.scrollIntoView({ behavior: "instant" });
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setShouldAnimate(false);
    }
  }, [pathname]);

  if (lg === null) {
    return null;
  }

  return (
    <nav
      className={`top-0 fixed left-0 lg:h-screen w-full h-18 ${
        hovered ? "lg:w-36" : "lg:w-18"
      } z-50 flex lg:px-2.5 lg:py-0 py-2.5 items-center justify-center transition-all duration-300`}
    >
      <AnimatePresence>
        <motion.div
          initial={
            shouldAnimate
              ? {
                  x: !lg ? 0 : -30,
                  y: !lg ? -30 : 0,
                  opacity: 0,
                }
              : false
          }
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={
            shouldAnimate
              ? {
                  x:
                    typeof window !== "undefined" && window.innerWidth < 1024
                      ? 0
                      : 30,
                  y:
                    typeof window !== "undefined" && window.innerWidth < 1024
                      ? 30
                      : 0,
                  opacity: 0,
                }
              : undefined
          }
          transition={{
            type: "spring",
            stiffness: 60,
            duration: 0.8,
            delay: 0,
            damping: 20,
          }}
          className="bg-gradient-to-br from-primary/20 via-background to-primary/10 border border-primary/5 rounded-2xl shadow-xl lg:w-full lg:h-auto h-full w-auto lg:py-4 lg:px-0.25 py-0.25 px-4 gap-2 flex lg:flex-col justify-center items-center backdrop-blur-md"
          onHoverEnd={() => setHovered(false)}
          onHoverStart={() => setHovered(true)}
        >
          {navlinks.map((navlink) => (
            <NavLink key={navlink.href} navlink={navlink} hovered={hovered} />
          ))}
          <ContactModal hovered={hovered} setHovered={setHovered} />
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
