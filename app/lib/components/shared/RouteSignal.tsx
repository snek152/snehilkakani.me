"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "./MotionPreference";

export type RouteScene = "builds" | "music" | "lens" | "reach";

export type RouteSignalProps = {
  scene: RouteScene;
  label: string;
  detail: string;
  className?: string;
};

const SCENES: Record<RouteScene, { path: string; mark: [number, number]; seam?: string }> = {
  builds: { path: "M3 29L23 29L42 10L78 10", mark: [42, 10], seam: "M3 35L31 35L48 18L78 18" },
  music: { path: "M3 25C12 25 12 12 21 12S30 32 39 32S48 16 57 16S66 25 78 25", mark: [39, 32], seam: "M3 34H78" },
  lens: { path: "M3 28H22L40 8L58 28H78", mark: [40, 8], seam: "M3 34H30L40 22L50 34H78" },
  reach: { path: "M3 27C18 27 24 9 40 9S57 27 78 27", mark: [40, 9], seam: "M3 34H78" },
};

export default function RouteSignal({ scene, label, detail, className }: RouteSignalProps) {
  const reduceMotion = useMotionPreference();
  const geometry = SCENES[scene];
  const drawDuration = reduceMotion ? 0 : beats(3);

  return (
    <div
      aria-hidden="true"
      data-route-signal={scene}
      data-signal-label={label}
      data-signal-detail={detail}
      className={`route-signal pointer-events-none select-none ${className ?? ""}`}
    >
      <svg viewBox="0 0 81 38" fill="none" focusable="false" aria-hidden="true">
        <motion.path
          className="route-signal__trajectory"
          d={geometry.path}
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: drawDuration, ease: EASE_OUT }}
        />
        {geometry.seam && (
          <motion.path
            className="route-signal__seam"
            d={geometry.seam}
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduceMotion ? 0 : beats(2.4),
              delay: reduceMotion ? 0 : beats(0.5),
              ease: EASE_OUT,
            }}
          />
        )}
        <motion.circle
          className="route-signal__source"
          cx={geometry.mark[0]}
          cy={geometry.mark[1]}
          r="2.25"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : beats(0.25), delay: reduceMotion ? 0 : drawDuration, ease: EASE_OUT }}
        />
      </svg>
    </div>
  );
}
