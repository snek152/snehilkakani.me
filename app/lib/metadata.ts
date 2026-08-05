import type { Metadata } from "next";

/**
 * Per-route `title`/`description`/`canonical`, plus the OpenGraph and
 * Twitter cards that go with them.
 *
 * This exists because of one Next.js behaviour that is easy to get wrong
 * and invisible when you do: a child segment's `metadata.openGraph` and
 * `metadata.twitter` *replace* the parent's object outright — they are
 * not merged field by field. A route that sets only
 * `openGraph: { title, description }` therefore silently drops
 * `og:site_name`, `og:locale` and `og:type`, and one that sets only
 * `twitter: { title }` silently downgrades `twitter:card` from
 * `summary_large_image` back to `summary`. Verified against the running
 * dev server, not assumed.
 *
 * `title` is passed through as a plain string so the root's
 * `%s | Snehil Kakani` template still applies to it — and to the
 * OpenGraph and Twitter titles, which carry the same template.
 *
 * The OG/Twitter *images* are not repeated here: they come from
 * `app/opengraph-image.png` and `app/twitter-image.png`, file
 * conventions that apply to every nested route on their own.
 */
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
      siteName: "Snehil Kakani",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
