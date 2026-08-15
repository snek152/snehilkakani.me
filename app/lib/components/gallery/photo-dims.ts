import { photoDims } from "@/app/lib/data/photo-dims.generated";

export function getPhotoDims(image: string): { w: number; h: number } {
  const dims = photoDims[image];
  if (!dims) {
    throw new Error(`getPhotoDims: missing generated dimensions for "${image}". Run \`npm run gen:dims\`.`);
  }
  return dims;
}
