/**
 * Renders a stored date range for display.
 *
 * The content files type ranges with an ASCII hyphen — "Jan 2026 - Present" —
 * because that is what a keyboard gives you. A range between two dates takes
 * an en dash. Doing it here rather than rewriting `experience.ts` and
 * `projects.ts` keeps those files plain text that anyone can edit without
 * knowing the convention, and keeps one hyphen from silently reintroducing
 * the wrong glyph on the next entry someone adds.
 *
 * Only a hyphen with spaces on both sides is a range separator, so hyphenated
 * words ("Full-time") are left alone.
 */
export function dateRange(value: string): string {
  return value.replace(/ - /g, " \u2013 ");
}
