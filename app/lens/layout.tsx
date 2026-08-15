import { routeMetadata } from "@/app/lib/metadata";

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
