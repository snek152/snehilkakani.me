"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import ContactForm from "@/app/lib/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/app/lib/components/contact/mailto";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
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
  const reduceMotion = useMotionPreference();
  const headingRef = useRef<HTMLDivElement>(null);
  // Same trigger the other page headings use.
  const headingActive = useInView(headingRef, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <main className="px-6 pb-20 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <motion.div
        ref={headingRef}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: beats(0.75), ease: EASE_OUT }}
        className="mb-11"
      >
        <ManifestoHeading
          as="h1"
          id="reach-heading"
          text="Let's talk."
          active={headingActive}
          className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.03em] text-fg"
        />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: beats(0.75), delay: reduceMotion ? 0 : beats(0.15), ease: EASE_OUT }}
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
              /* Opacity, not scale: this is an inline box inside a
               * paragraph, and `transform` does not apply to one. Hover
               * moves to `accent-text` because `accent` is the shapes-only
               * blue — 3.87:1 — and this is a word being read. */
              className="text-fg underline decoration-1 underline-offset-[3px] transition-[color,opacity] duration-[120ms] ease-[var(--ease-press)] hover:text-accent-text active:opacity-70 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <ContactForm />
        </section>

        <div
          role="group"
          className="hidden grid-cols-2 gap-1.5 lg:grid"
          aria-label="Selected photography"
        >
          {contactPhotos.map((photo, index) => (
            <motion.div
              key={photo.caption}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: beats(0.6),
                delay: reduceMotion ? 0 : Math.min(index, 3) * beats(0.15),
                ease: EASE_OUT,
              }}
              className="group relative aspect-[4/5] overflow-hidden bg-card"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 17vw, 0px"
                className="h-full w-full object-cover"
              />
              {/* `group-hover` is not gated on `(hover: hover)`, so on a
                * touch device wide enough for this grid (an iPad in
                * landscape) the caption stays up until the next tap
                * elsewhere. Left as is: the tile is not a control, the
                * overlay reveals a description rather than a state, and a
                * caption that lingers on the photo you just touched is the
                * only way a touch reader sees it at all. Gating it would
                * cost those users the caption to fix nothing.
                *
                * `aria-hidden` because each caption is the exact string
                * already carried by its image's `alt`; without it the four
                * photos are announced twice each. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-bg/85 via-bg/0 to-bg/0 p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <p className="text-sm leading-snug text-fg">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
