import type { Metadata } from "next";
import { Domine, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./lib/components/Navbar";
import { domAnimation, LazyMotion } from "motion/react";
// import Footer from "./lib/components/Footer";
// import dynamic from "next/dynamic";

const domine = Domine({
  variable: "--gfont-domine",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibm = IBM_Plex_Sans({
  variable: "--gfont-ibm",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const title = "Snehil Kakani - Software Engineer & Creative Developer";
const description =
  "Full-stack developer and creative technologist crafting innovative web solutions, producing music, and building meaningful digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL("https://snehilkakani.me"),
  title: {
    template: "%s | Snehil Kakani",
    default: title,
  },
  description: description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Snehil Kakani",
    "Software Engineer",
    "Full-stack Developer",
    "Creative Developer",
    "Web Development",
    "Music Production",
    "Portfolio",
    "Cal Poly SLO",
    "Computer Science",
  ],
  authors: [{ name: "Snehil Kakani", url: "https://snehilkakani.me" }],
  creator: "Snehil Kakani",
  // manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: {
      template: "%s | Snehil Kakani",
      default: title,
    },
    description: description,
    url: "/",
    siteName: "Snehil Kakani",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Snehil Kakani",
      default: title,
    },
    description: description,
  },
};

/*
  You can add a manifest.ts file in your app directory to generate a manifest.json file.
  Based on your metadata, the content of app/manifest.ts would be:

 
  export default function manifest(): MetadataRoute.Manifest {
    return 
  }

  Then, you can uncomment the 'manifest' line in your metadata object:
  manifest: "/manifest.json",
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${domine.variable} ${ibm.variable} antialiased relative overflow-x-hidden overflow-y-hidden h-full bg-secondary`}
      >
        <LazyMotion features={domAnimation} strict>
          <div className="flex flex-col lg:flex-row w-screen h-dvh lg:h-screen">
            <div className="lg:w-18 lg:h-screen flex-shrink-0">
              <Navbar />
            </div>
            <div
              id="container"
              className="overflow-x-hidden overflow-y-scroll relative h-full w-screen lg:h-screen lg:w-full flex-1"
            >
              <div className="w-full h-18 lg:hidden" id="topbar"></div>
              {children}
              {/* <Footer /> */}
            </div>
          </div>
        </LazyMotion>
      </body>
    </html>
  );
}
