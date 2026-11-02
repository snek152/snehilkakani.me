import type { Metadata } from "next";
import TerrainField from "@/app/lib/components/lab/TerrainField";
import { MotionPreferenceProvider } from "@/app/lib/components/shared/MotionPreference";

export const metadata: Metadata = {
  title: "Terrain field experiment",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TerrainPage() {
  return (
    <MotionPreferenceProvider>
      <main className="relative h-dvh w-full bg-bg">
        <TerrainField className="block h-full w-full" />
      </main>
    </MotionPreferenceProvider>
  );
}
