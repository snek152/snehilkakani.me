"use client";

import { useEffect, useState } from "react";

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/**
 * Live Pacific-time readout, updated once per minute. Lives in the site-wide
 * `Footer` (not the Hero card, where it competed with the photo/status
 * block) so it's a quiet, persistent "real person, real place" detail on
 * every page rather than a one-off widget. Renders nothing on the server and
 * on the first client render (both `null`) so hydration never mismatches;
 * the real time appears a tick later, after mount.
 */
export default function Clock() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLabel(FORMATTER.format(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!label) return null;

  return (
    <span className="hidden items-center gap-1.5 sm:inline-flex">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      San Luis Obispo · {label} PT
    </span>
  );
}
