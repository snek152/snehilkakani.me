import type { ReactNode } from "react";

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
}: ViewfinderFrameProps) {
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
      ).map((pos, i) => (
        <svg
          key={i}
          aria-hidden
          width={TICK}
          height={TICK}
          viewBox="0 0 14 14"
          fill="none"
          className={`pointer-events-none absolute text-accent ${animate ? "transition-opacity duration-150" : ""} ${active ? "opacity-100" : "opacity-0"}`}
          style={{
            top: "top" in pos ? pos.top : undefined,
            bottom: "bottom" in pos ? pos.bottom : undefined,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            transform: `rotate(${pos.rotate}deg)`,
          }}
        >
          <path d="M0 0H14" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0V14" stroke="currentColor" strokeWidth="1.5" />
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
