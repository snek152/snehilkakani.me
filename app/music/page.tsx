import { Metadata } from "next";
import Beats from "../lib/components/Beats";

export const metadata: Metadata = {
  title: "Music",
  description:
    "A collection of hip-hop and electronic beats I've produced varying in style, mood, and subgenre.",
};

export default function MusicPage() {
  return (
    <div className="min-h-dvh px-2 py-2 lg:py-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-domine text-center">
        Music Portfolio
      </h1>
      <Beats />
    </div>
  );
}
