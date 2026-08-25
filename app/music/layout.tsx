import { routeMetadata } from "@/app/lib/metadata";
import { MusicPlayerProvider } from "@/app/lib/components/music/MusicPlayerProvider";

export const metadata = routeMetadata({
  title: "Music",
  description:
    "Listen to original hip-hop beats by Snehil Kakani, and explore his released collaborations and sound work for live theatre.",
  path: "/music",
});

export default function MusicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MusicPlayerProvider>{children}</MusicPlayerProvider>;
}
