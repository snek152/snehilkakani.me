"use client";

import { Aperture, Binary, SlidersVertical, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

/**
 * A single connected loader instrument: the square, links, and discipline
 * marks settle clockwise, then release counterclockwise as one assembly into
 * the Hero beneath it. Individual mark vectors only create their final spatial
 * relationship to the Hero; they never independently rotate.
 *
 * Two details keep the motion from ever reading as "frozen":
 * 1. A slow, continuous idle sway (independent of gather/release) runs on the
 *    whole assembly at all times, so there is no dead hold between the marks
 *    arriving and the release beginning.
 * 2. Every release element shares one fixed total window (`RELEASE_MS`).
 *    Staggered elements get a start delay but a correspondingly shorter
 *    duration, so every mark/line/the group/the backdrop all reach full
 *    dissolve on the exact same frame — no element goes idle early while
 *    others (or the backdrop) keep going.
 */
const RADIUS = 140;
export const RELEASE_MS = 900;

const ORBIT_MARKS = [
  { Icon: Terminal, label: "engineering", x: -RADIUS * Math.SQRT1_2, y: -RADIUS * Math.SQRT1_2, angle: -135, release: { x: -160, y: 220 } },
  { Icon: SlidersVertical, label: "music", x: RADIUS * Math.SQRT1_2, y: -RADIUS * Math.SQRT1_2, angle: -45, release: { x: 40, y: -260 } },
  { Icon: Aperture, label: "photography", x: RADIUS * Math.SQRT1_2, y: RADIUS * Math.SQRT1_2, angle: 45, release: { x: 260, y: 200 } },
  { Icon: Binary, label: "research", x: -RADIUS * Math.SQRT1_2, y: RADIUS * Math.SQRT1_2, angle: 135, release: { x: -30, y: 280 } },
];

/** 152 — the handle — as the byte it is. Filled station = 1, hollow = 0.
 *  Eight bits, which is also how many stations a 45-degree ring has, which is
 *  also 1 + 5 + 2. The hub had been an empty square at the exact point four
 *  lines converge on, so the composition pointed at nothing; this gives it
 *  something to be, and something to do while the marks are still arriving. */
const BITS = [1, 0, 0, 1, 1, 0, 0, 0];
/* The whole byte must be written and have visibly chased before
 * `LoadingScreen` flips `complete` at 1500ms. Last station lands at
 * 0.18 + 7*0.055 + 0.38 = 0.945s, leaving ~550ms of chase. */
const BIT_START = 0.18;
const BIT_STEP = 0.055;
const BIT_ARRIVE = 0.38;

function BitRing({ size }: { size: number }) {
  const radius = size * 0.3;

  return (
    <>
      <motion.span
        className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
        style={{ width: radius * 2, height: radius * 2, translate: "-50% -50%" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.16, ease: EASE_OUT }}
      />

      {BITS.map((bit, index) => {
        const theta = (-90 + index * 45) * (Math.PI / 180);
        const dot = size * (bit ? 0.12 : 0.075);
        const delay = BIT_START + index * BIT_STEP;

        return (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 block"
            style={{
              translate: "-50% -50%",
              x: Math.cos(theta) * radius,
              y: Math.sin(theta) * radius,
            }}
            /* Overshoot on arrival: each station flares past full size as it
             * lands, so the byte reads as being written one bit at a time
             * rather than fading in as a finished graphic. */
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.75, 1] }}
            transition={{ duration: BIT_ARRIVE, delay, times: [0, 0.45, 1], ease: EASE_OUT }}
          >
            <motion.span
              className="block rotate-45"
              style={{
                width: dot,
                height: dot,
                background: bit ? "var(--accent)" : "transparent",
                border: bit ? undefined : "1px solid rgba(255,255,255,0.3)",
              }}
              /* The chase. Each station starts pulsing the moment it lands,
               * and since they land in sequence the phase offset around the
               * ring is what makes the flash travel — adding a second
               * per-index stagger on top pushed the last stations past the
               * 1500ms mark, so half the ring never lit at all. */
              animate={{ opacity: bit ? [1, 0.35, 1] : [0.55, 0.2, 0.55] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: delay + BIT_ARRIVE,
                ease: "easeInOut",
              }}
            />
          </motion.span>
        );
      })}

      {/* One bright station orbiting the ring, so there is always motion at the
        * centre even after all eight bits have resolved — this is the stretch
        * the idle sway alone used to have to cover. */}
      <motion.span
        className="absolute left-1/2 top-1/2"
        style={{ width: radius * 2, height: radius * 2, translate: "-50% -50%" }}
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 360, opacity: 1 }}
        transition={{
          rotate: { duration: 2.6, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.5, delay: BIT_START, ease: EASE_OUT },
        }}
      >
        <span
          className="absolute left-1/2 top-0 block rounded-full bg-white"
          style={{ width: size * 0.045, height: size * 0.045, translate: "-50% -50%" }}
        />
      </motion.span>
    </>
  );
}

export default function OrbitStage({ complete, scale = 1 }: { complete: boolean; scale?: number }) {
  const markSize = 44 * scale;
  /* 57% of the mark box. At 41% the glyphs floated with 27px of dead margin
   * on every side and read as too small for their frames. */
  const iconSize = 25 * scale;
  /* Bounded by the marks, not by taste. Their x/y use RADIUS *unscaled* while
   * `lineLength` scales, so a mark's nearest corner sits 75px from centre at
   * scale 2.1 — that keeps the whole assembly ~290px wide and inside a phone
   * viewport, which is worth more than having the links stop where the marks
   * do. So the hub cannot exceed ~44 before it touches them: at the 64 it
   * began life as, the marks overlapped its corners by 20px, which is the
   * other half of why the middle read badly. 42 leaves 12px of air. */
  const centerSize = 42 * scale;
  const lineLength = RADIUS * scale;
  /* Links begin at the hub's corner rather than at dead centre. Drawn from the
   * centre they crossed the hub as an X, which is the shape of a missing
   * image — a large part of why the middle read as empty. Masked rather than
   * shortened so the release still stretches from the same origin. */
  const linkGap = ((centerSize / 2) * Math.SQRT2 + 7 * scale) / lineLength;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ opacity: complete ? [1, 1, 0] : 1 }}
      transition={{
        duration: complete ? RELEASE_MS / 1000 : 0.4,
        times: complete ? [0, 0.65, 1] : undefined,
        ease: EASE_OUT,
      }}
    >
      {/* Continuous idle sway — always running, independent of gather/release,
          so the instrument never sits perfectly still. */}
      <motion.div
        animate={{ rotate: [0, 2.2, 0, -2.2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.7, rotate: -30, x: 0, y: 0 }}
          animate={
            complete
              ? { scale: 0, rotate: -150, x: -110, y: 160 }
              : { scale: 1, rotate: 0, x: 0, y: 0 }
          }
          transition={{ duration: complete ? RELEASE_MS / 1000 : 0.48, ease: EASE_OUT }}
        >
          <div
            className="absolute left-1/2 top-1/2 border border-accent"
            style={{
              width: centerSize,
              height: centerSize,
              translate: "-50% -50%",
              boxShadow: "0 0 0 1px rgba(37,99,235,0.18)",
            }}
          />

          {/* Rendered through the release too: unmounting on `complete` popped
            * the byte out on the exact frame everything else began animating
            * away. The parent scales and fades it with the rest. */}
          <BitRing size={centerSize} />

          {ORBIT_MARKS.map(({ angle }, index) => {
            const delayMs = complete ? index * 30 : (0.22 + index * 0.1) * 1000;
            const durationMs = complete ? RELEASE_MS - delayMs : 550;
            return (
              <motion.div
                key={`line-${angle}`}
                className="absolute left-1/2 top-1/2 h-px origin-left"
                style={{
                  width: lineLength,
                  rotate: `${angle}deg`,
                  background: `linear-gradient(to right, transparent 0 ${linkGap * 100}%, rgba(255,255,255,0.22) ${linkGap * 100}% 100%)`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: complete ? 2.4 : 1,
                  opacity: complete ? [1, 0.5, 0] : 1,
                }}
                transition={{
                  duration: durationMs / 1000,
                  delay: delayMs / 1000,
                  ease: EASE_OUT,
                }}
              />
            );
          })}

          {ORBIT_MARKS.map(({ Icon, label, x, y, release }, index) => {
            const delayMs = complete ? index * 50 : (0.2 + index * 0.1) * 1000;
            const durationMs = complete ? RELEASE_MS - delayMs : 620;
            return (
              <motion.div
                key={label}
                className="absolute left-1/2 top-1/2 flex items-center justify-center border border-white/[0.22] bg-white/[0.03] text-fg"
                style={{ width: markSize, height: markSize, translate: "-50% -50%" }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
                animate={{
                  opacity: complete ? [1, 1, 0] : 1,
                  x: complete ? release.x : x,
                  y: complete ? release.y : y,
                  scale: complete ? [1, 0.6, 0] : 1,
                }}
                transition={{
                  duration: durationMs / 1000,
                  delay: delayMs / 1000,
                  times: complete ? [0, 0.55, 1] : undefined,
                  ease: EASE_OUT,
                }}
              >
                <Icon size={iconSize} strokeWidth={1.65} aria-hidden="true" />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
