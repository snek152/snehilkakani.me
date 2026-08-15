import { routeMetadata } from "@/app/lib/metadata";

export const metadata = routeMetadata({
  title: "Reach - Contact",
  description:
    "Get in touch about software engineering roles and internships, freelance web work, or music and photography. Email directly or use the form on the page.",
  path: "/reach",
});

export default function ReachLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
