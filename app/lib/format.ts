export function dateRange(value: string): string {
  return value.replace(/ - /g, " \u2013 ");
}
