"use client";

import { Aperture, Binary, Braces, Waves } from "lucide-react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

/**
 * A single connected loader instrument: the square, links, and discipline
 * marks settle clockwise, then release counterclockwise as one assembly into
 * the Hero beneath it. Individual mark vectors only create their final spatial
 * relationship to the Hero; they never independently rotate.
 */
const RADIUS = 140;

export const ORBIT_MARKS = [
  { Icon: Braces, label: "engineering", x: -RADIUS * Math.SQRT1_2, y: -RADIUS * Math.SQRT1_2, angle: -135, release: { x: -160, y: 220 } },
  { Icon: Waves, label: "music", x: RADIUS * Math.SQRT1_2, y: -RADIUS * Math.SQRT1_2, angle: -45, release: { x: 40, y: -260 } },
  { Icon: Aperture, label: "photography", x: RADIUS * Math.SQRT1_2, y: RADIUS * Math.SQRT1_2, angle: 45, release: { x: 260, y: 200 } },
  { Icon: Binary, label: "research", x: -RADIUS * Math.SQRT1_2, y: RADIUS * Math.SQRT1_2, angle: 135, release: { x: -30, y: 280 } },
];

export default function OrbitStage({ complete, scale = 1 }: { complete: boolean; scale?: number }) {
  const markSize = 40 * scale;
  const iconSize = 17 * scale;
  const centerSize = 64 * scale;
  const lineLength = RADIUS * scale;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ opacity: complete ? 0 : 1 }}
      transition={{ duration: complete ? 0.85 : 0.32 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0.7, rotate: -30, x: 0, y: 0 }}
        animate={
          complete
            ? { scale: 1.14, rotate: -150, x: -110, y: 160 }
            : { scale: 1, rotate: 0, x: 0, y: 0 }
        }
        transition={{ duration: complete ? 0.72 : 0.48, ease: EASE_OUT }}
      >
        <div
          className="absolute left-1/2 top-1/2 border border-accent"
          style={{ width: centerSize, height: centerSize, translate: "-50% -50%" }}
        />

        {ORBIT_MARKS.map(({ angle }, index) => (
          <motion.div
            key={`line-${angle}`}
            className="absolute left-1/2 top-1/2 h-px origin-left bg-border"
            style={{ width: lineLength, rotate: `${angle}deg` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: complete ? 2.1 : 1, opacity: complete ? [1, 0] : 1 }}
            transition={{
              duration: complete ? 0.6 : 0.55,
              delay: complete ? index * 0.03 : 0.22 + index * 0.1,
              ease: EASE_OUT,
            }}
          />
        ))}

        {ORBIT_MARKS.map(({ Icon, label, x, y, release }, index) => (
          <motion.div
            key={label}
            className="absolute left-1/2 top-1/2 flex items-center justify-center border border-border bg-bg text-fg"
            style={{ width: markSize, height: markSize, translate: "-50% -50%" }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
            animate={{
              opacity: 1,
              x: complete ? release.x : x,
              y: complete ? release.y : y,
              scale: complete ? 0.5 : 1,
            }}
            transition={{
              duration: complete ? 0.6 : 0.62,
              delay: complete ? index * 0.06 : 0.2 + index * 0.1,
              ease: EASE_OUT,
            }}
          >
            <Icon size={iconSize} strokeWidth={1.5} aria-label={label} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
