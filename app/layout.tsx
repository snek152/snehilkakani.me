import type { Metadata } from "next";
import { Domine, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./lib/components/Navbar";
import { domAnimation, LazyMotion } from "motion/react";
import Footer from "./lib/components/Footer";
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

// export const metadata: Metadata = {
//   title: {
//     template: "%s | Snehil Kakani",
//     default: "Home",
//   },
//   description: "",
//   openGraph: {
//     type: "website",
//     title: {
//       template: "%s | Snehil Kakani",
//       default: "Home",
//     },
//     description:
//       "Explore Snehil Kakani's portfolio: software engineering projects, technical skills, and professional experience.",
//     locale: "en_US",
//     siteName: "Snehil Kakani Portfolio",
//     url: "https://euclidlearn.com",
//   },
//   robots: {
//     follow: true,
//     index: true,
//   },
// };

// sdf

export const metadata: Metadata = {
  title: "Snehil Kakani | Portfolio",
  description:
    "Explore Snehil Kakani's portfolio: software engineering projects, technical skills, and professional experience.",
};

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
        <LazyMotion features={domAnimation}>
          <div className="flex flex-col lg:flex-row w-screen h-svh lg:h-screen">
            <div className="lg:w-18 lg:h-screen flex-shrink-0">
              <Navbar />
            </div>
            <div
              id="container"
              className="overflow-x-hidden overflow-y-scroll relative h-full w-screen lg:h-screen lg:w-full flex-1"
            >
              <div className="w-full h-18 lg:hidden" id="topbar"></div>
              {children}
              <Footer />
            </div>
          </div>
        </LazyMotion>
      </body>
    </html>
  );
}
