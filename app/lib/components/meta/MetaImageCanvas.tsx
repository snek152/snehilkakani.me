"use client";

import { ROLES } from "@/app/lib/components/home/RoleCycle";
import OrbitStage from "@/app/lib/components/loader/OrbitStage";
import WaveField from "@/app/lib/components/shared/WaveField";

const FROZEN_MS = 4000;
const SIGNAL_SCALE = 1.3;

export default function MetaImageCanvas() {
  return (
    <section
      data-meta-image
      aria-label="Snehil Kakani meta image"
      className="relative isolate h-[630px] w-[1200px] overflow-hidden bg-bg text-fg"
    >
      <WaveField
        frozenAtMs={FROZEN_MS}
        variant="poster"
        className="pointer-events-none absolute inset-0 z-0"
      />

      <h1 className="absolute left-12 top-32 z-10 m-0 font-display text-[length:var(--size-meta-poster)] font-bold leading-[0.8] tracking-[var(--track-display-xl)] text-fg">
        <span className="block whitespace-nowrap">SNEHIL</span>
        <span className="ml-10 block whitespace-nowrap">KAKANI</span>
      </h1>

      <div aria-hidden="true" className="absolute right-12 top-[202px] z-10 h-40 w-40">
        <OrbitStage complete={false} frozen detail="signal" scale={SIGNAL_SCALE} />
      </div>

      <ul className="absolute inset-x-12 bottom-11 z-10 m-0 flex list-none items-baseline p-0 font-sans text-[length:var(--text-meta-ribbon)] leading-none">
        {ROLES.map((role, index) => (
          <li key={role} className="whitespace-nowrap">
            {index > 0 ? (
              <span aria-hidden="true" className="px-3 text-dim2">
                /
              </span>
            ) : null}
            <span
              className={index === 0 ? "font-medium text-fg" : "font-normal text-dim"}
            >
              {role}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
