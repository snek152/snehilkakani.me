import { routeMetadata } from "@/app/lib/metadata";

export const metadata = routeMetadata({
  title: "Builds - Software Projects",
  description:
    "Software projects with stack, dates and source links: Fere, an AI dev-tooling app that placed 2nd at Cal Poly Innovation Quest; Orbis; GU-Net glioma research.",
  path: "/builds",
});

export default function BuildsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
