"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import ContactForm from "@/app/lib/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/app/lib/components/contact/mailto";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import dog from "@/public/dog.jpg";
import photography from "@/public/photography2.jpg";
import spiderman from "@/public/spiderman.jpg";
import tahoe from "@/public/tahoe.jpg";

const contactPhotos = [
  { src: dog, caption: "My dog, Ollie" },
  {
    src: photography,
    caption: "Using my camera at a sunset in SLO",
  },
  {
    src: spiderman,
    caption: "My Spider-Man plushie",
  },
  {
    src: tahoe,
    caption: "Me and my friends on our trip to Tahoe",
  },
] as const;

export default function ContactPage() {
  const reduceMotion = useMotionPreference();
  const headingRef = useRef<HTMLDivElement>(null);

  const headingActive = useInView(headingRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  return (
    <div className="relative isolate overflow-hidden px-6 pb-12 pt-10 sm:px-8 lg:px-12 lg:pt-10">
      <motion.div
        ref={headingRef}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: beats(0.75), ease: EASE_OUT }}
        className="relative mb-2 min-h-10 lg:mb-4"
      >
        <ManifestoHeading
          as="h1"
          id="reach-heading"
          text="Let's talk."
          active={headingActive}
          className="font-display text-[length:var(--size-display-lg)] font-bold leading-none tracking-[var(--track-display-lg)] text-fg text-balance"
        />
        <RouteSignal
          scene="reach"
          label="Open transmission"
          detail="Contact channel"
          className="mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: beats(0.75),
          delay: reduceMotion ? 0 : beats(0.15),
          ease: EASE_OUT,
        }}
        className="relative grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,3fr)_minmax(15rem,2fr)] md:gap-x-[clamp(2rem,6vw,5rem)] md:gap-y-12"
      >
        <section aria-labelledby="contact-intro" className="max-w-[42rem]">
          <h2 id="contact-intro" className="sr-only">
            Send a message
          </h2>
          <p className="mb-10 max-w-[var(--measure-lead)] text-[length:var(--text-lead)] leading-[var(--leading-lead)] text-dim">
            Open to internships, collaborations, and interesting problems.{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-fg underline decoration-1 underline-offset-[3px] transition-[color,opacity] duration-[120ms] ease-[var(--ease-press)] hover:text-accent-text active:opacity-70 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <div>
            <ContactForm />
          </div>
        </section>

        <section aria-labelledby="contact-photos" className="self-start">
          <div className="mb-5 max-w-sm">
            <h2
              id="contact-photos"
              className="text-[length:var(--text-meta)] font-medium tracking-[var(--track-text-sm)] text-dim"
            >
              A few things outside of work.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {contactPhotos.map((photo, index) => (
              <motion.figure
                key={photo.caption}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: beats(0.6),
                  delay: reduceMotion ? 0 : Math.min(index, 3) * beats(0.15),
                  ease: EASE_OUT,
                }}
                className="relative aspect-[4/5] overflow-hidden bg-card"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  sizes="(min-width: 768px) 20vw, 44vw"
                  className="h-full w-full object-cover"
                />
              </motion.figure>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
