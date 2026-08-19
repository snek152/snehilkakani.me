import type { CSSProperties, ReactNode } from "react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";

type ViewfinderFrameProps = {
  children: ReactNode;

  captionLeft?: ReactNode;

  captionRight?: ReactNode;
  className?: string;

  active?: boolean;

  animate?: boolean;
};

const TICK = 14;

const TICK_IN = beats(0.25);
const TICK_OUT = beats(0.15);

const TICK_STEP = beats(0.05);

const TICK_SCALE = 1.3;
const EASE = `cubic-bezier(${EASE_OUT.join(",")})`;

const CORNERS: readonly { place: CSSProperties; origin: string; d: string }[] = [
  { place: { top: 0, left: 0 }, origin: "0% 0%", d: "M0 0H14M0 0V14" },
  { place: { top: 0, right: 0 }, origin: "100% 0%", d: "M0 0H14M14 0V14" },
  { place: { bottom: 0, right: 0 }, origin: "100% 100%", d: "M0 14H14M14 0V14" },
  { place: { bottom: 0, left: 0 }, origin: "0% 100%", d: "M0 14H14M0 0V14" },
];

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
          className={`pointer-events-none absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between gap-3 text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-dim tabular-nums ${animate ? "transition-opacity duration-150" : ""} ${active ? "opacity-100" : "opacity-0"}`}
        >
          {captionLeft && <span className="bg-bg/70 px-1 py-0.5">{captionLeft}</span>}
          {captionRight && <span className="bg-bg/70 px-1 py-0.5">{captionRight}</span>}
        </div>
      )}
    </div>
  );
}
