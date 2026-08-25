import { routeMetadata } from "@/app/lib/metadata";

export const metadata = routeMetadata({
  title: "Photography",
  description:
    "Photography by Snehil Kakani from Yosemite, New York, Germany, and California’s Central Coast, with exposure details for each image.",
  path: "/lens",
});

export default function LensLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
