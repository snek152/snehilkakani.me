import { routeMetadata } from "@/app/lib/metadata";

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
