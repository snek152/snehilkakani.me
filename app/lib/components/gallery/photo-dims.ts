import { photoDims } from "@/app/lib/data/photo-dims.generated";

/**
 * Looks up the generated dimensions for a canonical photo path. Throws a
 * clear error at render time rather than silently handing next/image a
 * fallback size (which would reintroduce layout shift / a distorted aspect
 * ratio for that cell).
 */
export function getPhotoDims(image: string): { w: number; h: number } {
  const dims = photoDims[image];
  if (!dims) {
    throw new Error(`getPhotoDims: missing generated dimensions for "${image}". Run \`npm run gen:dims\`.`);
  }
  return dims;
}
