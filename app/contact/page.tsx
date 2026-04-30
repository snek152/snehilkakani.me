import ContactForm from "../lib/components/ContactForm";
import Footer from "../lib/components/Footer";
// import ContactGallery from "../lib/components/ContactGallery";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import LoadingSpinner from "../lib/components/LoadingSpinner";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Interested in collaborating on a web project, creative venture, or anything in between? Send a message and let's build something together.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

const ContactGallery = dynamic(
  () => import("../lib/components/ContactGallery"),
);

export default function ContactPage() {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex-col items-center justify-center flex gap-8 px-4 py-2 lg:py-20">
        <div className="w-full bg-secondary p-8 bg-gradient-to-bl from-primary/20 via-background to-primary/10 border border-primary/5 rounded-2xl shadow-xl">
          <ContactForm />
          <p className="text-surface/50 text-sm font-ibm mt-4 text-center">
            Or reach me directly at{" "}
            <a
              href="mailto:kakanisnehil@gmail.com"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              kakanisnehil@gmail.com
            </a>
          </p>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <ContactGallery />
      </Suspense>
    </section>
  );
}
