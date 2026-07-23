"use client";

import { useEffect, useState } from "react";

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/**
 * Live Pacific-time clock, updated once per minute. Renders nothing on the
 * server and on the first client render (both `null`) so hydration never
 * mismatches; the real time appears a tick later, after mount.
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

  return <span>{label} PT</span>;
}
