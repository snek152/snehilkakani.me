"use client";
import { AnimatePresence, motion } from "motion/react";
import {
  UserCircleIcon as UserIconOutline,
  CommandLineIcon as CommandOutline,
  MusicalNoteIcon as MusicOutline,
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon as UserIconSolid,
  CommandLineIcon as CommandSolid,
  MusicalNoteIcon as MusicSolid,
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
    href: "/projects",
    label: "Projects",
  },
  {
    iconInactive: MusicOutline,
    iconActive: MusicSolid,
    href: "/music",
    label: "Music",
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
      className={`top-0 left-0 lg:h-screen w-full h-18 ${
        hovered ? "lg:w-36" : "lg:w-18"
      } z-50 flex lg:px-2 lg:py-0 py-2 items-center justify-center transition-all duration-300`}
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
          className="bg-gradient-to-br from-primary/20 via-background to-primary/10 border border-primary/5 rounded-2xl shadow-xl lg:w-full lg:h-auto h-full w-auto lg:py-5 lg:px-0 px-5 gap-2 flex lg:flex-col justify-center items-center backdrop-blur-md"
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
