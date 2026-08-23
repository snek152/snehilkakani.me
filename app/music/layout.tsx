import { routeMetadata } from "@/app/lib/metadata";
import { MusicPlayerProvider } from "@/app/lib/components/music/MusicPlayerProvider";

export const metadata = routeMetadata({
  title: "Music - Beats and Production",
  description:
    "Original hip-hop beats, playable in the page and listed with tempo and length. Released albums with other artists; head of sound for live theatre.",
  path: "/music",
});

export default function MusicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MusicPlayerProvider>{children}</MusicPlayerProvider>;
}
