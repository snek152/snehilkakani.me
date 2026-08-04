import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets concurrent dev servers on this same checkout keep separate build
  // dirs. Without it, two `next dev` processes share `.next` and corrupt
  // each other's chunks — which silently poisons any measurement taken
  // against them.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
