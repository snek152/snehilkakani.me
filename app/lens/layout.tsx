import { routeMetadata } from "@/app/lib/metadata";

export const metadata = routeMetadata({
  title: "Lens - Photography",
  description:
    "Photographs from Yosemite, New York, Germany and California's Central Coast, with exposure, shutter speed, aperture and ISO details.",
  path: "/lens",
});

export default function LensLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
