"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/app/lib/components/shared/Reveal";

/**
 * What replaced the scrolling keyword ticker between Hero and Experience.
 *
 * The ticker was decoration: a loop of nouns that said nothing the rest
 * of the page didn't already say, animating forever for attention. This
 * says one true thing instead — the actual local time where the work
 * happens, ticking in real time. It's the kind of detail a person adds
 * and a template doesn't, and it costs one interval and no scroll work.
 *
 * Rendered only after mount: the server has no business guessing the
 * reader's clock, and a hydration mismatch on a timestamp is a real bug.
 */
export default function StatusBand() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());

    setNow(format());
    const id = setInterval(() => setNow(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Reveal y={8} duration={0.4} amount={0.6} className="-mx-6 sm:-mx-8 lg:-mx-12">
      <div className="flex items-baseline justify-between gap-6 border-y border-t-0 border-border px-6 py-2.5 sm:px-8 lg:px-12">
        <p className="text-[0.62rem] uppercase tracking-[0.14em] text-dim2">
          San Luis Obispo, California
        </p>
        <p className="text-[0.62rem] uppercase tracking-[0.14em] text-dim2 tabular-nums">
          {/* Reserve the width so the band doesn't reflow on first tick. */}
          <span className="inline-block min-w-[5.5ch] text-right">{now ?? "--:--:--"}</span>
          <span className="ml-2 text-dim2/60">local</span>
        </p>
      </div>
    </Reveal>
  );
}
