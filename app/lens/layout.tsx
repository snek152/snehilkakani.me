import { routeMetadata } from "@/app/lib/metadata";

// Locations are the ones actually present in `app/lib/data/photos.ts`
// (Yosemite, New York, Berlin and Munich, and the Central Coast around
// Cayucos, Pismo and Bishop's Peak), and every frame there really does
// carry exp/shutter/aperture/iso. Nothing here is scene-setting.
export const metadata = routeMetadata({
  title: "Lens - Photography",
  description:
    "Photographs from Yosemite, New York, Germany and California's Central Coast, each frame captioned with the exposure, shutter speed, aperture and ISO it was shot at.",
  path: "/lens",
});

export default function LensLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
