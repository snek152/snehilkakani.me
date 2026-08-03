"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

type ViewfinderFrameProps = {
  /** Content the frame wraps — typically a photo, but any content works. */
  children: ReactNode;
  /** Optional mono readout in the bottom-left corner, e.g. a location or label. */
  captionLeft?: ReactNode;
  /** Optional mono readout in the bottom-right corner, e.g. a coordinate or index. */
  captionRight?: ReactNode;
  className?: string;
  /** Corner ticks + captions fade in/out on this instead of always
   * showing — for hover-gated use (e.g. a grid cell) rather than the
   * lightbox's always-visible frame. Defaults to always active. */
  active?: boolean;
  /** Set false to skip the CSS opacity transition entirely (respect
   * `prefers-reduced-motion` at the call site). Defaults to animated. */
  animate?: boolean;
  /** Seconds. When given, the four corners strike in on mount from this
   * delay, clockwise from the top-left, instead of simply being there.
   * For frames that open a page. */
  enterDelay?: number;
};

const TICK = 14;

/**
 * ViewfinderFrame — the site's one recurring signature motif: four thin
 * L-shaped corner brackets (camera-viewfinder / rule-of-thirds ticks) around
 * `children`, with optional small mono readout captions along the bottom
 * edge. Pure CSS/SVG, no gradients, no dependencies. Use sparingly — only
 * where photographic/visual content earns it.
 */
export default function ViewfinderFrame({
  children,
  captionLeft,
  captionRight,
  className = "",
  active = true,
  animate = true,
  enterDelay,
}: ViewfinderFrameProps) {
  const reduceMotion = useMotionPreference();

  return (
    <div className={`relative ${className}`}>
      {children}

      {/* corner ticks */}
      {(
        [
          { top: 0, left: 0, rotate: 0 },
          { top: 0, right: 0, rotate: 90 },
          { bottom: 0, right: 0, rotate: 180 },
          { bottom: 0, left: 0, rotate: 270 },
        ] as const
      ).map((pos, i) => {
        // `enterDelay` opts a frame into striking its corners in on
        // mount, clockwise from the top-left. Only the frames that open a
        // page use it; the gallery's cells gate their corners on hover
        // instead, and an entrance there would fight the hover.
        const striking = enterDelay !== undefined && !reduceMotion;
        return (
          <motion.svg
            key={i}
            aria-hidden
            width={TICK}
            height={TICK}
            viewBox="0 0 14 14"
            fill="none"
            className={`pointer-events-none absolute text-accent ${animate && !striking ? "transition-opacity duration-150" : ""} ${active || striking ? "opacity-100" : "opacity-0"}`}
            style={{
              top: "top" in pos ? pos.top : undefined,
              bottom: "bottom" in pos ? pos.bottom : undefined,
              left: "left" in pos ? pos.left : undefined,
              right: "right" in pos ? pos.right : undefined,
              // Rotation is handed to Motion when it's animating, since
              // it owns `transform` then and a CSS one would be lost.
              transform: striking ? undefined : `rotate(${pos.rotate}deg)`,
            }}
            initial={striking ? { opacity: 0, scale: 0.35, rotate: pos.rotate } : false}
            animate={striking ? { opacity: 1, scale: 1, rotate: pos.rotate } : undefined}
            transition={
              striking
                ? { duration: beats(0.55), ease: EASE_OUT, delay: enterDelay + i * beats(0.12) }
                : undefined
            }
          >
            <path d="M0 0H14" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 0V14" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
        );
      })}

      {(captionLeft || captionRight) && (
        <div
          className={`pointer-events-none absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between gap-3 text-sm tracking-[0.01em] text-fg/80 tabular-nums ${animate ? "transition-opacity duration-150" : ""} ${active ? "opacity-100" : "opacity-0"}`}
        >
          {captionLeft && <span className="bg-bg/70 px-1 py-0.5">{captionLeft}</span>}
          {captionRight && <span className="bg-bg/70 px-1 py-0.5">{captionRight}</span>}
        </div>
      )}
    </div>
  );
}
