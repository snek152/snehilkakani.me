# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: recruiters and hiring managers**, skimming for signal on an
internship or new-grad software candidate. They arrive with little time, often
from a résumé link, LinkedIn, or a referral, and they are deciding whether to
keep reading. The site's job is to make that decision easy and fast.

Served, but not driving decisions:

- **Engineers and peers** who want to see how the work was actually built —
  repos, technical decisions, depth behind the summaries.
- **Visitors who came for one discipline** — someone sent a beat link, or
  followed a photo. They should land somewhere complete rather than in a
  fragment of a résumé.

## Product Purpose

Snehil Kakani's personal site. It exists to make one person's range legible
quickly and credibly, and to end in contact: an email, a résumé download, or a
repo click.

Success is a recruiter who understands what he builds within a few seconds of
the first viewport, finds specific evidence for it without hunting, and leaves
with a way to reach him.

## Positioning

**Range is the claim.** Software engineering, music production, and photography
are presented as one identity rather than as a job plus two hobbies — and all
three are backed by real artifacts on the site, not assertions. A portfolio that
listed the same skills could not truthfully copy the combination, because the
evidence for each discipline is first-party work: shipped projects, original
beats, and his own photographs.

This is a structural commitment, not a tagline: `Builds`, `Music`, and `Lens`
carry equal weight in navigation, and the hero cycles roles across all three.
Future work must not quietly demote two of them into a footnote.

## Operating Context

Five surfaces, each a complete destination:

|Route|Purpose|
|---|---|
|`/`|Hero lockup, role cycler, discipline index, experience timeline|
|`/builds`|Featured project, project rows, skills matrix|
|`/music`|Beat releases with a persistent transport that survives navigation|
|`/lens`|Photography contact sheet with a lightbox|
|`/reach`|Contact form and links|

Content is authored as **TypeScript data modules** under `app/lib/data/` — no
CMS, no API, no markdown. Editing content means editing a typed array and
committing. Two of those files are generated and must not be hand-edited:
`beat-durations.ts` (from the MP3s via `ffprobe`) and
`photo-dims.generated.ts` (intrinsic image dimensions).

The audio transport is owned by the app shell, not by `/music`, so a track keeps
playing while the visitor reads other pages. Any future layout work has to
respect that a fixed player may be present on every route.

Published at `snehilkakani.me`.

## Capabilities and Constraints

- **Contact submits directly to Formspree.** `ContactForm` POSTs JSON
  (`{ name, email, message }`) to `https://formspree.io/f/xyylnqbg` using
  `mode: "no-cors"`. Its opaque fulfilled response has no readable status, so a
  fulfilled `fetch` is the successful submission signal; a rejected request
  leaves the form open for retry. Success clears the form and shows a
  confirmation; `Send another` restores the empty form and focuses the name
  field.
- There is still no database, auth, or server-side code in this project; the
  contact delivery is external.
- All routes are statically prerendered (14 at present, including generated
  icon and OG image routes).
- No test suite is configured; correctness is verified by build, lint, and
  running the site.
- Motion is derived from a single shared BPM-92 timing grid rather than
  per-component numbers, and reduced-motion is a provider-level concern several
  components delegate upstream.
- Stack facts are already answered by the codebase and intentionally not
  restated here.

## Brand Commitments

- **Name:** Snehil Kakani. **Wordmark:** `SK`.
- **Voice:** plain and factual. The existing copy states what was built, for
  whom, and what resulted — no hype, no superlatives, no growth-marketing
  register. Match it.
- **Real, load-bearing links** that must keep working:
  `github.com/snek152`, `linkedin.com/in/snehilkakani`,
  `kakanisnehil@gmail.com`.
- **`public/resume.pdf` stays a first-class, directly downloadable artifact.**
- Skills are presented as an inventory of tools used, never as a ranking.
  Proficiency bars, tiers, and percentages are unfalsifiable padding and are
  deliberately absent.

## Evidence on Hand

Real, first-party material already in the repository:

- **11 projects** with 20 real screenshots in `public/projects/`. Includes
  Fere, which won 2nd place and $10K at Cal Poly's Innovation Quest.
- **5 experience entries** in `app/lib/data/experience.ts`, most recent first —
  currently led by a software engineering internship at Lindy in San Francisco,
  working on infrastructure for a high-volume AI agent platform.
- **22 catalogued beats** backed by 23 original MP3s in `public/beats/`, each
  with a real tempo and category.
- **36 photographs** in `public/photos/`, each with EXIF-style capture data
  (exposure, shutter, aperture, ISO) and written alt text.
- **33 skills** with real tool icons, grouped by type.
- `public/resume.pdf`.
- Stated credentials: CS at Cal Poly SLO, published researcher, NMSC finalist.

**Absences that must never be invented:** there are no testimonials, no client
logos, no user counts, no traffic or performance metrics, no pricing, and no
case-study outcomes beyond the awards named above. The beats are a showcase and
are **not** for sale or licensing; the photographs are personal work and are
**not** prints for sale or client photography. Do not add a storefront,
licensing language, or commercial framing to either.

## Product Principles

1. **Recruiter-first, without flattening the range.** The fastest possible read
   for someone with thirty seconds, on a site that still treats three
   disciplines as peers.
2. **Every claim has an artifact behind it.** A repo, a screenshot, an MP3, a
   photograph, or an award. If there is no artifact, there is no claim.
3. **Each surface is a destination, not a résumé section.** A visitor who
   arrives directly at `/music` or `/lens` should find something whole.
4. **Say it plainly.** Factual copy in the existing register; no invented proof,
   no unfalsifiable self-assessment, no marketing voice.
5. **Content stays editable as typed data.** Adding work means editing an array
   in `app/lib/data/`, not restructuring a page.

## Accessibility & Inclusion

Treat the existing commitments as binding, not aspirational — they are enforced
in the code and documented at their callsites:

- **Contrast is deliberate and split by role.** The brand blue `--accent`
  (#2563eb, 3.87:1 on the near-black background) is for rules, fills, and
  icons; `--accent-text` (#4478ee, 4.93:1) is required for anything read as
  words. Body text stays at full opacity rather than being dimmed with opacity
  modifiers.
- **Three independent user preferences are honored:**
  `prefers-reduced-motion`, `prefers-reduced-transparency` (translucent
  surfaces become opaque, not merely dimmer), and `prefers-contrast: more`
  (near-solid surfaces with defined borders).
- Decorative layers are `aria-hidden` and pointer-inert; sections are named by
  real headings (`sr-only` where the heading is not visible); every photograph
  carries written alt text; focus-visible styles are explicit.
