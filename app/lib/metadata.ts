import type { Metadata } from "next";

export const SITE_URL = "https://snehilkakani.me";
export const SITE_NAME = "Snehil Kakani";

const SOCIAL_IMAGE_ALT =
  "Snehil Kakani — software engineer, music producer and photographer";

export const OPENGRAPH_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: SOCIAL_IMAGE_ALT,
};

export const TWITTER_IMAGE = {
  url: "/twitter-image.png",
  width: 1200,
  height: 630,
  alt: SOCIAL_IMAGE_ALT,
};

export function routeMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [OPENGRAPH_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}
