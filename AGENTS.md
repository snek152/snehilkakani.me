# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** portfolio site using React 19, TypeScript, and Tailwind CSS 4.

### Pages & Routes

| Route | Page file | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, index strip, experience |
| `/builds` | `app/builds/page.tsx` | Featured project, project rows, stack |
| `/music` | `app/music/page.tsx` | Beat release list + persistent transport |
| `/lens` | `app/lens/page.tsx` | Photography contact sheet + lightbox |
| `/reach` | `app/reach/page.tsx` | Contact |

Each route except `/` has a server `layout.tsx` beside it carrying that
route's `metadata`; the page components are `"use client"` and so cannot
export it themselves. Shared metadata values live in `app/lib/metadata.ts`.

### Data Layer

All content lives in TypeScript files under `app/lib/data/`. To add or edit portfolio content, edit these files — **no CMS, no API, no markdown**:

- `projects.ts` — `Project[]` with title, subtitle (date range), description, image, skills, and optional `link` / `github` / `privateRepo`
- `experience.ts` — `Experience[]` with title, company, location, period, description bullets, skills
- `beats.ts` — `Beat[]` with audio file path, category, tempo, description
- `beat-durations.ts` — track lengths in seconds, generated from the MP3s with `ffprobe`; regenerate when the beats change
- `skills.ts` — skill objects with icon (from `@icons-pack/react-simple-icons`), label, colorClass, and `type` (`"frontend"` | `"backend"` | `"AI"` | `"other"`), rendered as a grouped icon grid. It is an inventory of tools used, not a ranking — deliberately no proficiency levels, tiers or ratings, which are unfalsifiable and read as padding
- `photos.ts` — photo metadata with EXIF-style fields (aperture, ISO, etc.)
- `photo-dims.generated.ts` — intrinsic image dimensions, generated; do not hand-edit
- `app/lib/nav.ts` — navigation items (note: at `app/lib/`, not `app/lib/data/`)

### Component Patterns

- **`"use client"`** on all interactive components
- **`useInView`** from `motion/react` for scroll-triggered entrance animations, paired with `viewport={{ once: true }}` on `whileInView`. (Not `react-intersection-observer` — that dependency is gone.)
- Navbar expands on hover (desktop: vertical sidebar `lg:w-18` → `lg:w-36`; mobile: top bar)

### Styling

Tailwind CSS 4 with custom theme tokens defined in `app/globals.css` via `@theme`:

```
--color-primary:    #0d6efd  (blue accent)
--color-secondary:  #262626  (card/surface dark)
--color-surface:    #fbfbfb
--color-background: #2b2b2b  (page background)
--color-on-surface: #404040
```

**Fonts** — Epilogue (`--font-epilogue`, the `font-display` token, weights
600/700/800) for headings and display lines, Schibsted Grotesk
(`--font-schibsted-grotesk`, the `font-sans` token and the document default) for
body copy and UI text. Both load in `app/layout.tsx` via `next/font/google`;
Schibsted is a **variable** font, so its whole 400–900 range is available, while
Epilogue fetches only those three weights — a class asking for another gets
synthesized by the browser rather than rendered, so that list and the component
classes have to stay in step.

There is deliberately **no mono**. Numeric readouts (BPM, track durations, EXIF
triplets, viewfinder captions) use `tabular-nums` on the sans, which aligns the
figures without introducing a third voice.

**Display type scale** — four tiers, each taking one weight and one tracking
token from `globals.css`.

|Tier|Used for|Classes|
|---|---|---|
|XL|Hero name lockup|`font-extrabold tracking-[var(--track-display-xl)]`|
|LG|Full-page titles (`text-5xl`, `text-4xl`, `clamp(2.5rem,5vw,4rem)`)|`font-extrabold tracking-[var(--track-display-lg)]`|
|MD|Card + section headings (1.35rem–1.85rem, `text-2xl`)|`font-bold tracking-[var(--track-display-md)]`|
|SM|Small display labels (≤1.3rem: index labels, role cycler)|`font-semibold tracking-[var(--track-display-sm)]`|

The `SK` wordmark in `Sidebar` is the one documented exception: it sits at the
SM size but takes `font-extrabold`, because it is a brand mark rather than a
label.

Tracking is size-specific by design — never one value for the whole page, and
never a hand-picked number at the callsite. The values are tuned for Epilogue's
open geometric counters. Body copy sits at the face's natural fit; the uppercase
micro-labels keep their own positive `0.08em`.

### Static Assets

Public assets are organized by section under `public/`:
- `public/beats/` — MP3 audio files
- `public/photos/` — Photography portfolio images
- `public/projects/` — Project screenshot/cover images
- `public/resume.pdf` — Resume download

Project and skill images use static imports (`StaticImageData`) rather than public paths.

### Path Alias

`@/*` maps to the repo root (configured in `tsconfig.json`).

### Design Conventions

**Cards**
- Use `bg-secondary` (not `bg-background`) for card backgrounds — `bg-background` is the same as the page background (`#2b2b2b`) and will be invisible.
- Standard card: `bg-secondary border-[1.5px] border-secondary/60 rounded-xl overflow-hidden shadow-lg`
- Heavy card (e.g. AboutCard): `border-4 border-secondary bg-background rounded-xl` with a box-shadow glow via inline `style`

**Skill tags** — use this exact class string everywhere for consistency:
```
bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 text-surface z-20 relative px-3 py-1 rounded-full text-sm font-ibm border-2 border-primary/70 shadow-md hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg transition-all duration-200 font-semibold
```

**Typography hierarchy** (dark backgrounds)
- Heading: `text-surface font-domine font-bold` — `text-xl lg:text-2xl` for card titles, `text-3xl lg:text-4xl` for section titles
- Subheading: `text-surface/70 font-ibm font-semibold text-sm lg:text-base`
- Meta (period, location): `text-surface/60` and `text-surface/50` at `text-sm font-ibm`
- Body: `text-surface font-ibm text-sm lg:text-base leading-relaxed`
- Do not add opacity modifiers just to dim body text — use `text-surface` at full opacity for readable content

**Bullet points** (in lists)
```
<span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0 mt-[0.65rem]" />
```
Parent `<li>` should use `flex items-start gap-2.5` — never `items-center` or `self-center` on the dot, which causes misalignment on wrapped lines.

**Animations** — standard entrance pattern, applied directly on a
`motion.*` element:
```tsx
initial={reduceMotion ? false : { opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: beats(0.75), ease: EASE_OUT }}
```
`EASE_OUT` and `beats()` come from `app/lib/motion.ts` and `app/lib/tempo.ts` — a
single BPM-92 timing grid (`app/lib/tempo.ts`) every entrance duration derives
from, instead of components picking their own numbers in isolation. The shared
`fadeUp`/`staggerContainer` variants in `app/lib/motion.ts` carry the same
values for anything driven by named `variants` (page headers, staggered lists)
rather than inline targets. Always respect `useMotionPreference()` (from
`app/lib/components/shared/MotionPreference.tsx`) for reduced-motion users.
Note that some components delegate this upstream rather than branching
themselves — `CursorGlow` renders nothing because `CursorField` clears
`active`, `BeatBars` sits still because `useAudioAnalyser` never starts its
frame loop, and `OrbitStage` is never mounted because `LoadingScreen`
substitutes a plain backdrop. Check the provider before adding a branch.

A `Reveal` wrapper component used to be documented here as the standard. It
was deleted — nothing ever imported it, and every component had gone on
writing the pattern above inline. Reintroducing a wrapper is fine, but it
would have to actually be adopted.

**Experience data ordering** — most recent first in `experience.ts`.
