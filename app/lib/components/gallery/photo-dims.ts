import { photoDims } from "@/app/lib/data/photo-dims.generated";

export function getPhotoDims(image: string): { w: number; h: number } {
  const dims = photoDims[image];
  if (!dims) {
    throw new Error(`getPhotoDims: missing generated dimensions for "${image}". Run \`npm run gen:dims\`.`);
  }
  return dims;
}

export function lightboxSizesFor(image: string): string {
  const { w, h } = getPhotoDims(image);
  const aspect = w / h;
  return `min(88vw, 1100px, calc(min(76vh, 780px) * ${aspect}))`;
}
