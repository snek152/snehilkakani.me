"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import featPhotos from "@/app/lib/data/photos";
import { EASE_OUT } from "@/app/lib/motion";
import OrbitStage from "./OrbitStage";

type Variant = "orbit" | "lanes" | "contact";

type LoaderPreviewProps = {
  variant: Variant;
  title: string;
  description: string;
};

export default function LoaderPreview({ variant, title, description }: LoaderPreviewProps) {
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setComplete(false);
    if (reduceMotion) {
      setComplete(true);
      return;
    }
    const timer = window.setTimeout(() => setComplete(true), 1500);
    return () => window.clearTimeout(timer);
  }, [run, reduceMotion]);

  const replay = () => setRun((value) => value + 1);

  return (
    <main className="min-h-[100dvh] bg-bg px-6 pb-12 pt-24 sm:px-10 lg:px-14">
      <header className="mb-8 flex items-end justify-between border-b border-border pb-5">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Loader study</p>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-fg sm:text-5xl">{title}</h1>
        </div>
        <button type="button" onClick={replay} className="border border-border px-3 py-1.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent">
          Replay
        </button>
      </header>
      <p className="mb-8 max-w-xl text-sm leading-relaxed text-dim">{description}</p>

      <section key={run} className="relative min-h-[min(68vh,680px)] overflow-hidden border border-border bg-card" aria-label={`${title} animation preview`}>
        {variant === "orbit" && (
          <>
            <OrbitStage complete={complete} />
            <HeroResolve complete={complete} reduceMotion={reduceMotion} />
          </>
        )}
        {variant === "lanes" && <LaneStage complete={complete} reduceMotion={reduceMotion} />}
        {variant === "contact" && <ContactStage complete={complete} reduceMotion={reduceMotion} />}
      </section>
    </main>
  );
}


function LaneStage({ complete, reduceMotion }: { complete: boolean; reduceMotion: boolean | null }) {
  const lanes = ["CODE", "SOUND", "LENS"];
  return (
    <>
      <div className="absolute inset-0 grid grid-cols-3">
        {lanes.map((lane, index) => (
          <motion.div key={lane} className="relative border-r border-border last:border-r-0" initial={{ scaleY: 0 }} animate={{ scaleY: complete ? 1 : 0.7 }} transition={{ duration: 0.52, delay: index * 0.11, ease: EASE_OUT }}>
            <motion.span className="absolute left-4 top-4 text-sm font-semibold tracking-[0.16em] text-dim2" initial={{ opacity: 0 }} animate={{ opacity: complete ? 0 : 1 }} transition={{ delay: 0.28 + index * 0.1 }}>{lane}</motion.span>
            <motion.div className="absolute inset-x-0 h-px bg-accent" initial={{ top: "0%" }} animate={{ top: complete ? `${22 + index * 23}%` : "78%" }} transition={{ duration: 0.85, delay: index * 0.1, ease: EASE_OUT }} />
          </motion.div>
        ))}
      </div>
      <HeroResolve complete={complete} reduceMotion={reduceMotion} />
    </>
  );
}

function ContactStage({ complete, reduceMotion }: { complete: boolean; reduceMotion: boolean | null }) {
  return (
    <>
      <div className="absolute inset-0 grid grid-cols-3 gap-px bg-border">
        {featPhotos.slice(0, 9).map((photo, index) => (
          <motion.div key={photo.image} className="relative overflow-hidden bg-bg" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: complete ? 0 : 1, scale: complete ? 0.84 : 1 }} transition={{ duration: 0.35, delay: index * 0.055, ease: EASE_OUT }}>
            <Image src={photo.image} alt="" fill sizes="33vw" className="object-cover" />
          </motion.div>
        ))}
      </div>
      <motion.div className="absolute inset-0 bg-bg" initial={{ opacity: 0 }} animate={{ opacity: complete ? 1 : 0 }} transition={{ duration: 0.2, delay: 0.65 }} />
      <HeroResolve complete={complete} reduceMotion={reduceMotion} />
    </>
  );
}

function HeroResolve({ complete, reduceMotion }: { complete: boolean; reduceMotion: boolean | null }) {
  return (
    <motion.div className="absolute inset-0 flex items-end p-6 sm:p-10" initial={{ opacity: 0, y: 18 }} animate={{ opacity: complete || reduceMotion ? 1 : 0, y: complete || reduceMotion ? 0 : 18 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Three disciplines, one practice</p>
        <p className="font-display text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-fg">Make things<br />that move.</p>
      </div>
    </motion.div>
  );
}
