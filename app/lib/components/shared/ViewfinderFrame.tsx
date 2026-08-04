import type { CSSProperties, ReactNode } from "react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";

type ViewfinderFrameProps = {
  /** Content the frame wraps — typically a photo, but any content works. */
  children: ReactNode;
  /** Optional readout in the bottom-left corner, e.g. a location or label. */
  captionLeft?: ReactNode;
  /** Optional readout in the bottom-right corner, e.g. a coordinate or index. */
  captionRight?: ReactNode;
  className?: string;
  /** Corner ticks + captions reveal on this instead of always showing —
   * for hover-gated use (e.g. a grid cell) rather than the lightbox's
   * always-visible frame. Defaults to always active. */
  active?: boolean;
  /** Set false to skip the reveal transition entirely (respect
   * `prefers-reduced-motion` at the call site). Defaults to animated. */
  animate?: boolean;
};

const TICK = 14;

/* Tick reveal, on the site's tempo grid.
 *
 * A flat cross-fade on four static brackets reads as nothing happening
 * at all. What a viewfinder actually does when focus locks is snap its
 * brackets inward: they arrive slightly overlong and contract onto the
 * frame's corners, one after another. So each tick is pinned by its own
 * outer corner (`transformOrigin`) and scales from `TICK_SCALE` down to
 * exact while it fades up, in clockwise order from the top-left.
 *
 * Only the entrance is choreographed. Leaving is the same move without
 * the stagger and at two-thirds the duration — an exit that performs is
 * an exit that gets in the way. */
const TICK_IN = beats(0.25);
const TICK_OUT = beats(0.15);
/** Interval between corners — the same one `GalleryCell` staggers its
 * plate entrances by, so a tick sweep pulses at the grid's own rate. */
const TICK_STEP = beats(0.05);
/** Overlong start length as a multiple of `TICK`: 14px → 18.2px. Enough
 * to read as a contraction at a glance, not enough to look like a
 * separate element sliding in. */
const TICK_SCALE = 1.3;
const EASE = `cubic-bezier(${EASE_OUT.join(",")})`;

/** The four brackets, clockwise from top-left. Each carries its own
 * explicit path rather than one shared path rotated into position: the
 * rotation had to spin about the element's centre to land correctly,
 * which left `transform-origin` unavailable for the scale — and a tick
 * scaled about its centre drifts off its corner and outside the frame,
 * where half the parents clip it. Written out per corner, `transform`
 * is free to be pure scale about the corner that must stay put. The
 * rendered geometry is identical to the rotated version. */
const CORNERS: readonly { place: CSSProperties; origin: string; d: string }[] = [
  { place: { top: 0, left: 0 }, origin: "0% 0%", d: "M0 0H14M0 0V14" },
  { place: { top: 0, right: 0 }, origin: "100% 0%", d: "M0 0H14M14 0V14" },
  { place: { bottom: 0, right: 0 }, origin: "100% 100%", d: "M0 14H14M14 0V14" },
  { place: { bottom: 0, left: 0 }, origin: "0% 100%", d: "M0 14H14M0 0V14" },
];

/**
 * ViewfinderFrame — the site's one recurring signature motif: four thin
 * L-shaped corner brackets (camera-viewfinder / rule-of-thirds ticks) around
 * `children`, with optional small readout captions along the bottom
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
}: ViewfinderFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {children}

      {/* corner ticks */}
      {CORNERS.map((corner, i) => (
        <svg
          key={i}
          aria-hidden
          width={TICK}
          height={TICK}
          viewBox="0 0 14 14"
          fill="none"
          className={`pointer-events-none absolute text-accent ${active ? "opacity-100" : "opacity-0"}`}
          style={{
            ...corner.place,
            transformOrigin: corner.origin,
            // Frames that are active from first paint (Hero, the
            // lightbox, the featured card) mount already at scale 1, so
            // no transition has a start value to run from and they stay
            // exactly as still as before.
            transform: animate ? (active ? "scale(1)" : `scale(${TICK_SCALE})`) : undefined,
            transition: animate
              ? active
                ? `opacity ${TICK_IN}s ${EASE} ${i * TICK_STEP}s, transform ${TICK_IN}s ${EASE} ${i * TICK_STEP}s`
                : `opacity ${TICK_OUT}s ${EASE}, transform ${TICK_OUT}s ${EASE}`
              : undefined,
          }}
        >
          <path d={corner.d} stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ))}

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
