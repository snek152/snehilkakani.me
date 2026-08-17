export function projectYear(subtitle?: string): string {
  if (!subtitle) return "";
  const years = subtitle.match(/\d{4}/g);
  if (!years || years.length === 0) return "";
  const first = years[0];
  const last = years[years.length - 1];
  if (first === last) return first;
  return `${first}\u2013${last.slice(2)}`;
}
