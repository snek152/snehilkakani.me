"use client";

import OrbitStage from "@/app/lib/components/loader/OrbitStage";
import Image from "next/image";

export default function MetaImageCanvas() {
  return (
    <section
      data-meta-image
      aria-label="Snehil Kakani meta image"
      className="relative grid h-[630px] w-[1200px] grid-cols-[54fr_46fr] overflow-hidden bg-bg text-fg"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-24 left-[54%] border-l border-border"
      />

      <div className="flex min-w-0 flex-col justify-center px-20">
        <Image
          src="/brand-mark.svg"
          alt=""
          aria-hidden="true"
          width={64}
          height={64}
          unoptimized
          priority
          className="size-16"
        />

        <h1 className="mt-11 font-display text-[length:var(--size-display-xl)] font-bold leading-[0.94] tracking-[var(--track-display-xl)]">
          <span className="block">Snehil</span>
          <span className="block">Kakani</span>
        </h1>

        <div className="mt-8 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-12 bg-accent" />
          <p className="text-[length:var(--text-lead)] text-dim">Software Engineer</p>
        </div>

        <div className="mt-12 text-[length:var(--text-body)] leading-[var(--leading-body)]">
          <p>Agent infrastructure @ Lindy</p>
          <p>Computer Science @ Cal Poly SLO</p>
        </div>

        <p className="mt-14 text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim2">
          snehilkakani.me
        </p>
      </div>

      <div className="relative flex h-full min-w-0 items-center justify-center">
        <OrbitStage complete={false} frozen showLabels scale={1.5} />
      </div>
    </section>
  );
}
