import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2400, 3840],
  },
};

export default nextConfig;
