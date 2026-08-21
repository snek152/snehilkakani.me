import type { Metadata } from "next";
import LinkedInBannerCanvas from "@/app/lib/components/meta/LinkedInBannerCanvas";
import { MotionPreferenceProvider } from "@/app/lib/components/shared/MotionPreference";

export const metadata: Metadata = {
  title: "LinkedIn banner preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LinkedInBannerPage() {
  return (
    <MotionPreferenceProvider>
      <LinkedInBannerCanvas />
    </MotionPreferenceProvider>
  );
}
