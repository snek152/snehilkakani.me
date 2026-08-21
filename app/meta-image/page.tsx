import type { Metadata } from "next";
import MetaImageCanvas from "@/app/lib/components/meta/MetaImageCanvas";

export const metadata: Metadata = {
  title: "Meta image preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MetaImagePage() {
  return <MetaImageCanvas />;
}
