import { routeMetadata } from "@/app/lib/metadata";

// Track list and categories come from `app/lib/data/beats.ts`; the album
// and live-sound claims from the last entry in
// `app/lib/data/experience.ts`. No counts here on purpose — the library
// grows, and a description that says "22 beats" is wrong the next time
// it does.
export const metadata = routeMetadata({
  title: "Music - Beats and Production",
  description:
    "Original hip-hop beats, filterable by category and playable in the page, each listed with its tempo. Released albums with other artists; head of sound for live theatre.",
  path: "/music",
});

export default function MusicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
