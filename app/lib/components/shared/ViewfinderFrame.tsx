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

const TICK = 22;

const TICK_IN = beats(0.25);
const TICK_OUT = beats(0.15);

const TICK_STEP = beats(0.05);

const TICK_SCALE = 1.3;
const EASE = `cubic-bezier(${EASE_OUT.join(",")})`;

const CORNERS: readonly { place: CSSProperties; origin: string; flipX: boolean; flipY: boolean }[] = [
  { place: { top: 0, left: 0 }, origin: "0% 0%", flipX: false, flipY: false },
  { place: { top: 0, right: 0 }, origin: "100% 0%", flipX: true, flipY: false },
  { place: { bottom: 0, right: 0 }, origin: "100% 100%", flipX: true, flipY: true },
  { place: { bottom: 0, left: 0 }, origin: "0% 100%", flipX: false, flipY: true },
];

const DOTS = Array.from({ length: 16 }, (_, n) => {
  const i = n % 4;
  const j = Math.floor(n / 4);
  const w = 1 - (i + j) / 6;
  return { x: 2.5 + i * 5.5, y: 2.5 + j * 5.5, r: 0.4 + 1.2 * w, keep: w > 0.2 };
}).filter((d) => d.keep);

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
          viewBox={`0 0 ${TICK} ${TICK}`}
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
          {DOTS.map((d) => (
            <circle
              key={`${d.x}-${d.y}`}
              cx={corner.flipX ? TICK - d.x : d.x}
              cy={corner.flipY ? TICK - d.y : d.y}
              r={d.r}
              fill="currentColor"
            />
          ))}
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
