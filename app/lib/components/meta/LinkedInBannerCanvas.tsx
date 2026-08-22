"use client";

import { ROLES } from "@/app/lib/components/home/RoleCycle";
import LoaderMatrix from "@/app/lib/components/loader/LoaderMatrix";
import WaveField from "@/app/lib/components/shared/WaveField";

const FROZEN_MS = 4000;

export default function LinkedInBannerCanvas() {
  return (
    <section
      data-linkedin-banner
      aria-label="Snehil Kakani LinkedIn banner"
      className="relative isolate h-[396px] w-[1584px] overflow-hidden bg-bg text-fg"
    >
      <WaveField
        frozenAtMs={FROZEN_MS}
        variant="poster"
        className="pointer-events-none absolute inset-0 z-0"
      />

      <ul className="absolute left-[520px] top-1/2 z-10 m-0 grid -translate-y-1/2 list-none grid-cols-[auto_auto] gap-x-16 gap-y-7 p-0 font-sans text-[length:var(--text-meta-stack)] leading-none">
        {ROLES.map((role, index) => (
          <li
            key={role}
            className={
              index === 0
                ? "whitespace-nowrap font-medium text-fg"
                : "whitespace-nowrap font-normal text-dim"
            }
          >
            {role}
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="absolute left-[1198px] top-[198px] z-10 h-px w-[218px] bg-white/[0.22]"
      />

      <div
        aria-hidden="true"
        className="absolute right-20 top-[110px] z-10 h-[176px] w-[176px]"
      >
        <LoaderMatrix />
      </div>
    </section>
  );
}
