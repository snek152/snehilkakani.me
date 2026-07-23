"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import ContactForm from "@/app/lib/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/app/lib/components/contact/mailto";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { EASE_OUT } from "@/app/lib/motion";
import musicProd from "@/public/music_prod.jpg";
import photography from "@/public/photography.jpeg";
import webdev from "@/public/webdev.jpg";
import lenaea from "@/public/lenaea.jpg";

const contactPhotos = [
  { src: musicProd, alt: "Putting together a new beat", caption: "Putting together a new beat" },
  {
    src: photography,
    alt: "Prepping my camera for a shoot in NYC",
    caption: "Prepping my camera for a shoot in NYC",
  },
  {
    src: webdev,
    alt: "Presenting about Git at Web Dev club",
    caption: "Presenting about Git at Web Dev club",
  },
  {
    src: lenaea,
    alt: "Performing onstage at a theatre festival",
    caption: "Performing onstage at a theatre festival",
  },
] as const;

export default function ContactPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="px-6 pb-20 pt-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-[4.5rem]">
      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE_OUT }}
        className="mb-11 font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.03em] text-fg"
      >
        Let&apos;s talk.
      </motion.h1>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: reduceMotion ? 0 : 0.1, ease: EASE_OUT }}
        className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-[4.5rem]"
      >
        <section aria-labelledby="contact-intro">
          <h2 id="contact-intro" className="sr-only">
            Send a message
          </h2>
          <p className="mb-11 text-[0.95rem] leading-[1.8] text-dim">
            Open to internships, collaborations, and interesting problems.{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-fg underline decoration-1 underline-offset-[3px] transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <ContactForm />
        </section>

        <div
          className="hidden grid-cols-2 gap-1.5 lg:grid"
          aria-label="Selected photography"
        >
          {contactPhotos.map((photo, index) => {
            const image = (
              <Image
                src={photo.src}
                alt={photo.alt}
                sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 17vw, 0px"
                className="h-full w-full object-cover"
              />
            );

            return (
              <motion.div
                key={photo.caption}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : 0.2 + index * 0.065,
                  ease: EASE_OUT,
                }}
                className="group relative aspect-[4/5] overflow-hidden bg-card"
              >
                {index === 1 ? (
                  <ViewfinderFrame className="h-full w-full">
                    {image}
                  </ViewfinderFrame>
                ) : (
                  image
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-bg/85 via-bg/0 to-bg/0 p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                  <p className="text-sm leading-snug text-fg">{photo.caption}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
