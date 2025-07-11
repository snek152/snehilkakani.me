"use client";
import { AnimatePresence, motion } from "motion/react";
import {
  UserCircleIcon as UserIconOutline,
  CommandLineIcon as CommandOutline,
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon as UserIconSolid,
  CommandLineIcon as CommandSolid,
} from "@heroicons/react/24/solid";
import NavLink from "./NavLink";
import { type NavLink as navlinkT } from "../types";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const navlinks: navlinkT[] = [
  {
    iconInactive: UserIconOutline,
    iconActive: UserIconSolid,
    href: "/",
    label: "Home",
  },
  {
    iconInactive: CommandOutline,
    iconActive: CommandSolid,
    href: "/about",
    label: "About",
  },
];

export default function Navbar() {
  const [hovered, setHovered] = useState<boolean>(false);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setShouldAnimate(false);
    }
  }, [pathname]);

  return (
    <nav
      className={` top-0 left-0 h-screen ${
        hovered ? "w-36" : "w-18"
      } z-50 flex px-2 flex-col items-center justify-center transition-all duration-300`}
    >
      <AnimatePresence>
        <motion.div
          initial={shouldAnimate ? { x: -30, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          exit={shouldAnimate ? { x: 30, opacity: 0 } : undefined}
          transition={{
            type: "spring",
            stiffness: 60,
            duration: 0.8,
            delay: 0,
            damping: 20,
          }}
          className="bg-surface rounded-2xl shadow-lg w-full py-5 flex flex-col justify-center items-center"
          onHoverEnd={() => setHovered(false)}
          onHoverStart={() => setHovered(true)}
        >
          {navlinks.map((navlink) => (
            <NavLink key={navlink.href} navlink={navlink} hovered={hovered} />
          ))}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
