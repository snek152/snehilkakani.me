/** Extracts a display year (or year range) from a subtitle like
 * "September 2022 - June 2025" -> "2022–25", or "June 2023 - July 2023" -> "2023".
 * Never invents a date: returns "" when no 4-digit year is present. */
export function projectYear(subtitle?: string): string {
  if (!subtitle) return "";
  const years = subtitle.match(/\d{4}/g);
  if (!years || years.length === 0) return "";
  const first = years[0];
  const last = years[years.length - 1];
  if (first === last) return first;
  return `${first}\u2013${last.slice(2)}`;
}

/** Uses the segment before a colon as the display title, since canonical
 * titles are "Short Name: Longer descriptive subtitle". Falls back to the
 * full title when no colon is present. */
export function shortTitle(title: string): string {
  const idx = title.indexOf(":");
  return idx === -1 ? title : title.slice(0, idx).trim();
}
