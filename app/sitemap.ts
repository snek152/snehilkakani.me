import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/metadata";
import { navItems } from "@/app/lib/nav";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/builds": 0.9,
  "/reach": 0.8,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return navItems.map((item) => ({
    url: `${SITE_URL}${item.href === "/" ? "" : item.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: PRIORITY[item.href] ?? 0.7,
  }));
}
